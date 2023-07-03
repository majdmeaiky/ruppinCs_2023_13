using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fair_Scheduling_Application_Server.Models.DAL
{
    public class Fair_Schedualing_Algorithm
    {
        private int Size { get; set; }

        private List<int[,]> Duplicated_SchduleMatrix_List = new List<int[,]>();
        private int Propablity = 100000;
        private List<WorkerInShift> ScheduleList = new List<WorkerInShift>();
        private int prop = 1;

        private int counter_prop = 1;
        public List<WorkerInShift> ActivetFairSchedulingAlgorithm(List<Request> requests, Dictionary<int, int> Workers_possitions, string Company_Name, int shift_id)
        {
            Size = Workers_possitions.Count * 7;

            int[,] RequestsMatrix = InsertRequestsToMatrix(requests);

            //dynamic programing algorithm with- create duplicated matrices such that they stands for no day shift after night shift
            PreProcessing(RequestsMatrix, 0, 2);

            //activation of the hungarian algorithm on each of the duplicated matrices
            int[] PossionOfWorkers_InMatrix = Find_Best_Schedule();



            int[] m = new int[7];
            int[] e = new int[7];
            int[] n = new int[7];
            init_shifts_arrays(m, e, n, PossionOfWorkers_InMatrix, Workers_possitions);
            init_shifts_list(m, e, n, Company_Name, shift_id);

            return ScheduleList;

        }
        public void PreProcessing(int[,] m, int ii, int jj)
        {

            for (int i = ii; i < Size - 1; i++)
            {
                if ((i + 1) % 7 == 0)
                    continue;
                if (m[i, (i * 3 + 2) % 21] != int.MaxValue && m[i + 1, (i * 3 + 2) % 21 + 1] != int.MaxValue)
                {
                    int[,] a = m.Clone() as int[,];
                    int[,] b = m.Clone() as int[,];
                    a[i, (i * 3 + 2) % 21] = int.MaxValue;
                    b[i + 1, (i * 3 + 2) % 21 + 1] = int.MaxValue;
                    Random rand = new Random();
                    int action = rand.Next(1, prop);
                    if (action == 1)
                    {
                        counter_prop++;
                        if (counter_prop % Propablity == 0)
                        {
                            prop++;
                        }

                        PreProcessing(a, i + 1, (i * 3 + 2) % 21 + 3);
                        PreProcessing(b, i + 1, (i * 3 + 2) % 21 + 3);

                    }
                    return;
                }

            }
            Duplicated_SchduleMatrix_List.Add(m);
        }
        public int[,] InsertRequestsToMatrix(List<Request> requests)
        {
            int index = 0;
            int[,] RequestsMatrix = new int[Size, Size];

            for (int i = 0; i < Size; i++)
            {
                for (int j = 0; j < Size; j++)
                {
                    RequestsMatrix[i, j] = int.MaxValue;
                    if (j > 20)
                        RequestsMatrix[i, j] = 0;
                }
            }

            int worker_counter = 0;
            for (int i = 0; i < Size; i++)
            {

                for (int j = 0; j < 21; j++)
                {
                    if (index == j)
                    {
                        for (int counter = 0; counter < 3; counter++)
                        {
                            if (requests[worker_counter].priorety == 3)
                                requests[worker_counter].priorety = int.MaxValue;
                            RequestsMatrix[i, j + counter] = requests[worker_counter].priorety;
                            worker_counter++;
                        }
                        j += 2;
                    }
                }
                Console.WriteLine(index);
                index += 3;
                if (index > 18)
                    index = 0;

            }
            return RequestsMatrix;
        }
        public int[] Find_Best_Schedule()
        {
            int[] chossen_matrix = new int[Size];
            Random rand = new Random();
            int chossen_matrix_val = int.MaxValue;
            int listPos_counter = -1;
            int listPos = 0;
            int possibleSolutions = 0;
            foreach (var matrix in Duplicated_SchduleMatrix_List)
            {

                listPos_counter++;
                var algorithm = new HungarianAlgorithm(matrix);
                var result = algorithm.Run();
                int res = HungarianAlgorithm.printArraySum(matrix, result);

                if (int.MaxValue != res)
                {
                    possibleSolutions++;
                }
                if (chossen_matrix_val > res)
                {

                    listPos = listPos_counter;
                    chossen_matrix_val = res;
                    chossen_matrix = result;
                }
                else if (chossen_matrix_val == res)
                {
                    int action = rand.Next(1, 100);
                    if (action == 1)
                    {
                        listPos = listPos_counter;
                        chossen_matrix_val = res;
                        chossen_matrix = result;

                    }

                }
            }
            if(chossen_matrix_val == int.MaxValue){
                throw new RankException("Didn't found valid schedule");
            }
            return chossen_matrix;
        }
        public void init_shifts_list(int[] m, int[] e, int[] n, string Company_Name, int shift_id)
        {
            for (int i = 0; i < 7; i++)
            {
                WorkerInShift new_workerE = new WorkerInShift(e[i], Company_Name, shift_id);
                shift_id++;

                WorkerInShift new_workerM = new WorkerInShift(m[i], Company_Name, shift_id);
                shift_id++;

                WorkerInShift new_workerN = new WorkerInShift(n[i], Company_Name, shift_id);
                shift_id++;

                ScheduleList.Add(new_workerM);
                ScheduleList.Add(new_workerE);
                ScheduleList.Add(new_workerN);

            }

        }

        public void init_shifts_arrays(int[] m, int[] e, int[] n, int[] chossen_matrix, Dictionary<int, int> Workers_possitions)
        {
            int worker_count = 7;
            int worker_index = 0;

            for (int i = 0; i < chossen_matrix.Length; i++)
            {
                if (i >= worker_count)
                {
                    worker_count += 7;
                    worker_index++;
                }
                if (chossen_matrix[i] < 21)
                {

                    if (chossen_matrix[i] % 3 == 0)
                    {
                        m[chossen_matrix[i] / 3] = Workers_possitions[worker_index];

                    }
                    if (chossen_matrix[i] % 3 == 1)
                    {
                        e[chossen_matrix[i] / 3] = Workers_possitions[worker_index];

                    }
                    if (chossen_matrix[i] % 3 == 2)
                    {
                        n[chossen_matrix[i] / 3] = Workers_possitions[worker_index];

                    }
                }
            }
        }
        
        public sealed class HungarianAlgorithm
        {
            private readonly int[,] _costMatrix;
            private int _inf;
            private int _n; //number of elements
            private int[] _lx; //labels for workers
            private int[] _ly; //labels for jobs 
            private bool[] _s;
            private bool[] _t;
            private int[] _matchX; //vertex matched with x
            private int[] _matchY; //vertex matched with y
            private int _maxMatch;
            private int[] _slack;
            private int[] _slackx;
            private int[] _prev; //memorizing paths

            /// <summary>
            /// 
            /// </summary>
            /// <param name="costMatrix"></param>
            public HungarianAlgorithm(int[,] costMatrix)
            {
                _costMatrix = costMatrix;
            }

            /// <summary>
            /// 
            /// </summary>
            /// <returns></returns>
            public int[] Run()
            {
                _n = _costMatrix.GetLength(0);

                _lx = new int[_n];
                _ly = new int[_n];
                _s = new bool[_n];
                _t = new bool[_n];
                _matchX = new int[_n];
                _matchY = new int[_n];
                _slack = new int[_n];
                _slackx = new int[_n];
                _prev = new int[_n];
                _inf = int.MaxValue;


                InitMatches();

                if (_n != _costMatrix.GetLength(1))
                    return null;

                InitLbls();

                _maxMatch = 0;

                InitialMatching();

                var q = new Queue<int>();

                #region augment

                while (_maxMatch != _n)
                {
                    q.Clear();

                    InitSt();
                    //Array.Clear(S,0,n);
                    //Array.Clear(T, 0, n);


                    //parameters for keeping the position of root node and two other nodes
                    var root = 0;
                    int x;
                    var y = 0;

                    //find root of the tree
                    for (x = 0; x < _n; x++)
                    {
                        if (_matchX[x] != -1) continue;
                        q.Enqueue(x);
                        root = x;
                        _prev[x] = -2;

                        _s[x] = true;
                        break;
                    }

                    //init slack
                    for (var i = 0; i < _n; i++)
                    {
                        _slack[i] = _costMatrix[root, i] - _lx[root] - _ly[i];
                        _slackx[i] = root;
                    }

                    //finding augmenting path
                    while (true)
                    {
                        while (q.Count != 0)
                        {
                            x = q.Dequeue();
                            var lxx = _lx[x];
                            for (y = 0; y < _n; y++)
                            {
                                if (_costMatrix[x, y] != lxx + _ly[y] || _t[y]) continue;
                                if (_matchY[y] == -1) break; //augmenting path found!
                                _t[y] = true;
                                q.Enqueue(_matchY[y]);

                                AddToTree(_matchY[y], x);
                            }
                            if (y < _n) break; //augmenting path found!
                        }
                        if (y < _n) break; //augmenting path found!
                        UpdateLabels(); //augmenting path not found, update labels

                        for (y = 0; y < _n; y++)
                        {
                            //in this cycle we add edges that were added to the equality graph as a
                            //result of improving the labeling, we add edge (slackx[y], y) to the tree if
                            //and only if !T[y] &&  slack[y] == 0, also with this edge we add another one
                            //(y, yx[y]) or augment the matching, if y was exposed

                            if (_t[y] || _slack[y] != 0) continue;
                            if (_matchY[y] == -1) //found exposed vertex-augmenting path exists
                            {
                                x = _slackx[y];
                                break;
                            }
                            _t[y] = true;
                            if (_s[_matchY[y]]) continue;
                            q.Enqueue(_matchY[y]);
                            AddToTree(_matchY[y], _slackx[y]);
                        }
                        if (y < _n) break;
                    }

                    _maxMatch++;

                    //inverse edges along the augmenting path
                    int ty;
                    for (int cx = x, cy = y; cx != -2; cx = _prev[cx], cy = ty)
                    {
                        ty = _matchX[cx];
                        _matchY[cy] = cx;
                        _matchX[cx] = cy;
                    }
                }

                #endregion

                return _matchX;
            }

            private void InitMatches()
            {
                for (var i = 0; i < _n; i++)
                {
                    _matchX[i] = -1;
                    _matchY[i] = -1;
                }
            }

            private void InitSt()
            {
                for (var i = 0; i < _n; i++)
                {
                    _s[i] = false;
                    _t[i] = false;
                }
            }

            private void InitLbls()
            {
                for (var i = 0; i < _n; i++)
                {
                    var minRow = _costMatrix[i, 0];
                    for (var j = 0; j < _n; j++)
                    {
                        if (_costMatrix[i, j] < minRow) minRow = _costMatrix[i, j];
                        if (minRow == 0) break;
                    }
                    _lx[i] = minRow;
                }
                for (var j = 0; j < _n; j++)
                {
                    var minColumn = _costMatrix[0, j] - _lx[0];
                    for (var i = 0; i < _n; i++)
                    {
                        if (_costMatrix[i, j] - _lx[i] < minColumn) minColumn = _costMatrix[i, j] - _lx[i];
                        if (minColumn == 0) break;
                    }
                    _ly[j] = minColumn;
                }
            }

            private void UpdateLabels()
            {
                var delta = _inf;
                for (var i = 0; i < _n; i++)
                    if (!_t[i])
                        if (delta > _slack[i])
                            delta = _slack[i];
                for (var i = 0; i < _n; i++)
                {
                    if (_s[i])
                        _lx[i] = _lx[i] + delta;
                    if (_t[i])
                        _ly[i] = _ly[i] - delta;
                    else _slack[i] = _slack[i] - delta;
                }
            }

            private void AddToTree(int x, int prevx)
            {
                //x-current vertex, prevx-vertex from x before x in the alternating path,
                //so we are adding edges (prevx, matchX[x]), (matchX[x],x)

                _s[x] = true; //adding x to S
                _prev[x] = prevx;

                var lxx = _lx[x];
                //updateing slack
                for (var y = 0; y < _n; y++)
                {
                    if (_costMatrix[x, y] - lxx - _ly[y] >= _slack[y]) continue;
                    _slack[y] = _costMatrix[x, y] - lxx - _ly[y];
                    _slackx[y] = x;
                }
            }

            private void InitialMatching()
            {
                for (var x = 0; x < _n; x++)
                {
                    for (var y = 0; y < _n; y++)
                    {
                        if (_costMatrix[x, y] != _lx[x] + _ly[y] || _matchY[y] != -1) continue;
                        _matchX[x] = y;
                        _matchY[y] = x;
                        _maxMatch++;
                        break;
                    }
                }
            }
            public static void printArray(int[] array)
            {
                Console.WriteLine("Array:");
                var size = array.Length;
                for (int i = 0; i < size; i++)
                {
                    if (i % 7 == 0)
                        Console.WriteLine();
                    Console.Write("{0,5:0}", array[i]);
                }
                Console.WriteLine();
            }

            public static int printArraySum(int[,] matrix, int[] array)
            {
                int sum = 0;
                for (int i = 0; i < array.Length; i++)
                {
                    sum += matrix[i, array[i]];
                    if (matrix[i, array[i]] == int.MaxValue)
                    {
                        return int.MaxValue;
                    }
                }
                return sum;
            }
        }
    }
}