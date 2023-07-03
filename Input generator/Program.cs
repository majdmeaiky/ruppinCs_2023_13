using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;


namespace ConsoleApp10
{
    class Program
    {
        public static Dictionary<int, Dictionary<int, List<int>>> majd;
        private static int Size = 7*12;
        public static int employss = Size / 7;
        public static List<List<int>> matan ;
        public static int[,] michael;
        public static int fileName;
        static void Main(string[] args)
        {
            for(int i = 0; i < 50; i++) { 
                fileName = i;
                init_majd();
                init_matan();
                BulidJobRequestsSimulator();
                print_majd();
                print_matan();
                print_mivhael();
            }
        }
        
        public static void BulidJobRequestsSimulator()
        {
            michael = new int[Size, Size];
            Random rand = new Random();
            int index = 0;
            

            for (int i = 0; i < Size; i++)
            {

                for (int j = 0; j < Size; j++)
                {
                    michael[i, j] = int.MaxValue;
                    if (j > 20)
                        michael[i, j] = 0;
                }
            }


            for (int i = 0; i < Size; i++)
            {
               
                for (int j = 0; j < 21; j++)
                {

                    if (index == j)
                    {
                        for (int counter = 0; counter < 3; counter++)
                        {
                            int action = rand.Next(0, 10);
                            switch (action)
                            {
                                case 0:
                                    michael[i, j + counter] = 1;
                                    majd[i/7][counter].Add(1);
                                    matan[i / 7].Add(1);
                                    break;
                                case 1:
                                    michael[i, j + counter] = 2;
                                    majd[i / 7][counter].Add(2);
                                    matan[i / 7].Add(2);
                                    break;
                                case 2:
                                    michael[i, j + counter] = 2;
                                    majd[i / 7][counter].Add(2);
                                    matan[i / 7].Add(2);
                                    break;
                                case 3:
                                    michael[i, j + counter] = int.MaxValue;
                                    majd[i / 7][counter].Add(3);
                                    matan[i / 7].Add(3);

                                    break;
                                case 4:
                                    michael[i, j + counter] = int.MaxValue;
                                    majd[i / 7][counter].Add(3);
                                    matan[i / 7].Add(3);

                                    break;
                                case 5:
                                    michael[i, j + counter] = int.MaxValue;
                                    majd[i / 7][counter].Add(3);
                                    matan[i / 7].Add(3);

                                    break;
                                case 6:
                                    michael[i, j + counter] = int.MaxValue;
                                    majd[i / 7][counter].Add(3);
                                    matan[i / 7].Add(3);

                                    break;
                                case 7:
                                    michael[i, j + counter] = int.MaxValue;
                                    majd[i / 7][counter].Add(3);
                                    matan[i / 7].Add(3);

                                    break;
                                case 8:
                                    michael[i, j + counter] = int.MaxValue;
                                    majd[i / 7][counter].Add(3);
                                    matan[i / 7].Add(3);

                                    break;
                                case 9:
                                    michael[i, j + counter] = int.MaxValue;
                                    majd[i / 7][counter].Add(3);
                                    matan[i / 7].Add(3);
                                    break;
                            }
                        }
                        j += 2;
                    }


                }
                index += 3;
                if (index > 18)
                    index = 0;
            }

        }
        static void init_matan()
        {
            matan = new List<List<int>>();
            for (int i = 0; i < Size/7; i++)
            {
                matan.Add(new List<int>());
            }
        }
        static void init_majd()
        {
            majd = new Dictionary<int, Dictionary<int, List<int>>>();
            for (int i = 0; i < Size / 7; i++)
            {
                majd.Add(i, new Dictionary<int, List<int>>());
                for (int k = 0; k < 3; k++)
                {
                    majd[i].Add(k, new List<int>());
                }

            }

        }
        static void print_majd()
        {
            string json = JsonConvert.SerializeObject(majd, Formatting.Indented);
            File.WriteAllText("../../majd hard " + employss + "/" + fileName + ".txt", json);

        }

        static void print_matan()
        {
            string json = JsonConvert.SerializeObject(matan, Formatting.Indented);
            File.WriteAllText("../../matan hard "+ employss + "/" + fileName + ".txt", json);


        }

        static void print_mivhael()
        {
            string json = JsonConvert.SerializeObject(michael, Formatting.Indented);
            string convertedString = ConvertBrackets(json);
            File.WriteAllText("../../michael hard "+ employss + "/" + fileName + ".txt" , convertedString);

        }
        static string ConvertBrackets(string input)
        {
            char[] characters = input.ToCharArray();

            for (int i = 0; i < characters.Length; i++)
            {

                // Replace "[" with "{"
                input = input.Replace("[", "{");

                // Replace "]" with "}"
                input = input.Replace("]", "}");

                // Remove "\r\n"
                input = input.Replace("\r\n", "");

                return input;
            }

            return new string(characters);
        }
    }

}
