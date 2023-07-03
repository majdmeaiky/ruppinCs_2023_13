using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Transactions;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using ClosedXML.Excel;

namespace Fair_Scheduling_Application_Server.Models.DAL
{
    public class Data_Services
    {
        //create schedule
        public List<WorkerInShift> CreateSchedule(string Company_Code, int weeklyCounter)
        {
            Dictionary<int, int> Workers_possitions = new Dictionary<int, int>();
            List<Request> weekly_requests = new List<Request>();
            List<WorkerInShift> WorkersInScedule=new List<WorkerInShift>();
            int workers_poss = 0;
            int workers_counter = 0;
            int min_shift_id = int.MaxValue;
           
               
            using (SqlConnection con = Connect())
            {
                    
                using (SqlCommand command = new SqlCommand("DeleteSchedule", con))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Company_Code", Company_Code);
                    command.Parameters.AddWithValue("@weeklyCounter", weeklyCounter);
                    command.ExecuteNonQuery();
                }
               
                try
                {
                    using (TransactionScope scope = new TransactionScope())
                    {
                        SqlCommand command1 = CreateScheduleCommand(con, Company_Code, weeklyCounter);
                        SqlDataReader dr = command1.ExecuteReader();
                        
                        string Company_Name = "";
                        while (dr.Read())
                        {
                            Request request = new Request();

                            request.Worker_Id = (int)dr["Worker_Id"];
                            if (!Workers_possitions.ContainsKey(workers_poss))
                            {
                                Workers_possitions[workers_poss] = request.Worker_Id;

                            }
                            request.Request_Id = Convert.ToInt32(new Guid(dr["Request_Id"].ToString()).ToString("N").Substring(0, 8), 16);
                            request.priorety = (int)dr["priorety"];
                            request.Shift_Id = (int)dr["Shift_Id"];
                            if (request.Shift_Id < min_shift_id)
                                min_shift_id = request.Shift_Id;
                            request.Company_Name = (string)dr["Company_Name"];
                            Company_Name = request.Company_Name;
                            weekly_requests.Add(request);
                            workers_counter++;
                            if (workers_counter % 21 == 0 && workers_counter != 0)
                                workers_poss++;
                        }
                        dr.Close();
                        Fair_Schedualing_Algorithm fair_Schedualing_Algorithm = new Fair_Schedualing_Algorithm();
                        WorkersInScedule = fair_Schedualing_Algorithm.ActivetFairSchedulingAlgorithm(weekly_requests, Workers_possitions, Company_Name, min_shift_id);

                        foreach (var worker in WorkersInScedule)
                        {
                            SqlCommand cmd = new SqlCommand("INSERT INTO Workers_In_Shifts ( Worker_Id,Company_Name, Shift_Id) VALUES (@Worker_Id, @Company_Name, @Shift_Id)", con);
                            cmd.Parameters.AddWithValue("@Worker_Id", worker.Worker_Id);
                            cmd.Parameters.AddWithValue("@Company_Name", worker.Company_Name);
                            cmd.Parameters.AddWithValue("@Shift_Id", worker.Shift_Id);
                            cmd.ExecuteNonQuery();
                        }
                        scope.Complete();
                        con.Close();
                    }
                }
                catch (Exception ex)
                {
                    // throw new HttpException(403, "Create Schedule Failed");
                }
                

            }

            return WorkersInScedule;

        }

        internal List<WeeklyRequests> GETWeeklyRequests(string comapny_Name, int weekly_Counter)
        {
            List<WeeklyRequests> weeklyRequestsList = new List<WeeklyRequests>();
            using (SqlConnection con = Connect())
            {
                Dictionary<string, string> d = new Dictionary<string, string>();
                d["E"] = "Evening";
                d["M"] = "Morning";
                d["N"] = "Night";

                SqlCommand command = new SqlCommand("DownloadExcel", con);
                command.Parameters.AddWithValue("@Company_Name", comapny_Name);
                command.Parameters.AddWithValue("@weekly_Counter", weekly_Counter);
                command.CommandType = CommandType.StoredProcedure;
                SqlDataReader dr = command.ExecuteReader();
                while (dr.Read())
                {
                    
                    WeeklyRequests wr = new WeeklyRequests();
                    wr.Worker_Id=(int)dr["Worker_Id"]; 
                    wr.priorety = (int)dr["priority"];
                    string t= (string)dr["Type"];
                    wr.Type = d[t];
                        
                    wr.Worker_Email=(string)dr["Email"];
                    wr.Worker_Name=(string)dr["Name"];
                    wr.date = (DateTime)dr["Shift_date"];
                    weeklyRequestsList.Add(wr);
                }
                con.Close();
            }

            return weeklyRequestsList;
        }


    

        internal HttpResponseMessage UpdateWorker(Worker worker)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand command = new SqlCommand("UpdateWorker", con))
                {

                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Worker_Id", worker.Worker_Id);
                    command.Parameters.AddWithValue("@Name", worker.Name);
                    command.Parameters.AddWithValue("@Email", worker.Email);
                    command.Parameters.AddWithValue("@Start_Date", worker.Start_Date);
                    command.Parameters.AddWithValue("@Is_Manager", worker.Is_Manager);
                    command.Parameters.AddWithValue("@Company_Code", worker.Company_Code);

                    int rowsAffected = (int)command.ExecuteScalar();
                    con.Close();

                    if (rowsAffected > 0)
                    {
                        return new HttpResponseMessage(HttpStatusCode.Created)
                        {
                            Content = new StringContent("Worker updated successfully")
                        };
                    }
                    else
                    {
                        return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                        {
                            Content = new StringContent("Failed to update worker")
                        };
                    }
                }
            }
        }

        public List<WorkerRequestsFromClient> GetEmployRequests(int worker_ID, string Company_Name,int WeeklyCounter)
        {
            List<WorkerRequestsFromClient> workerRequsets = new List<WorkerRequestsFromClient>();

            using (SqlConnection con = Connect())
            {
                    using (SqlCommand command = new SqlCommand("getWorkerRequest", con))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@Company_Name", SqlDbType.NVarChar).Value = Company_Name;
                        command.Parameters.Add("@Worker_Id", SqlDbType.Int).Value = worker_ID;
                        command.Parameters.Add("@WeeklyCounter", SqlDbType.Int).Value = WeeklyCounter;
                    SqlDataReader dr = command.ExecuteReader(CommandBehavior.CloseConnection);
                        while (dr.Read())
                        {
                            WorkerRequestsFromClient workerRequst = new WorkerRequestsFromClient();
                            workerRequst.priorety = (int)dr["priorety"];
                            workerRequst.date = (DateTime)dr["Shift_Date"];
                            workerRequst.Company_Code = (string)dr["Company_Code"];
                            workerRequst.Worker_Id = (int)dr["Worker_Id"];
                            workerRequst.Type = (string)dr["Type"];
                            workerRequsets.Add(workerRequst);
                        }
                    }
                con.Close();
            }
            return workerRequsets;
          
        }

        public void  AddWorkerToShift(WorkerInShift workerInShift)
        {
           
            using (SqlConnection con = Connect())
            {
                using (SqlCommand command = new SqlCommand("AddWorkerToShift", con))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Worker_Id", workerInShift.Worker_Id);
                    command.Parameters.AddWithValue("@Company_Code", workerInShift.Company_Name);
                    command.Parameters.AddWithValue("@Shift_Id", workerInShift.Shift_Id);
                    command.ExecuteNonQuery();
                    con.Close();
                }
            }
           
        }
        public HttpResponseMessage DeleteWorkerInShift(WorkerInShift workerInShift)
        {

            using (SqlConnection con = Connect())
            {
                using (SqlCommand command = new SqlCommand("DeleteWorkerInShift", con))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Worker_Id", workerInShift.Worker_Id);
                    command.Parameters.AddWithValue("@Company_Code", workerInShift.Company_Name);
                    command.Parameters.AddWithValue("@Shift_Id", workerInShift.Shift_Id);
                    try
                    {
                        command.ExecuteNonQuery();
                        con.Close();
                        return new HttpResponseMessage(HttpStatusCode.OK)
                        {
                            Content = new StringContent($"Worker with Worker_Id { workerInShift.Worker_Id } deleted.")
                        };
                    }
                    catch(Exception E)
                    {
                        return new HttpResponseMessage(HttpStatusCode.BadRequest)
                        {
                            Content = new StringContent($"ERROR not found.")
                        };
                    }
                    
                }
            }
           

        }

        internal HttpResponseMessage DeleteWorker(int Worker_Id, string Company_Code)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand command = new SqlCommand("DeleteWorker", con))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Worker_Id", Worker_Id);
                    command.Parameters.AddWithValue("@Company_Code", Company_Code);

                    SqlParameter rowsAffectedParam = new SqlParameter("@RowsAffected", System.Data.SqlDbType.Int);
                    rowsAffectedParam.Direction = System.Data.ParameterDirection.Output;
                    command.Parameters.Add(rowsAffectedParam);
                    command.ExecuteNonQuery();
                    int rowsAffected = (int)command.Parameters["@RowsAffected"].Value;
                    con.Close();
                    if (rowsAffected == 0)
                    {
                        return new HttpResponseMessage(HttpStatusCode.BadRequest)
                        {
                            Content = new StringContent( $"Worker with Worker_Id { Worker_Id } and Company_Code { Company_Code } not found.")
                        };
                    }
                    else
                    {
                        return new HttpResponseMessage(HttpStatusCode.OK)
                        {
                            Content = new StringContent($"Worker with Worker_Id { Worker_Id } and Company_Code { Company_Code } deleted.")
                        };
                    }
                }
            }
        }

        public HttpResponseMessage PostEmployRequests(List<WorkerRequestsFromClient> workerRequests)
        {
            using (SqlConnection con = Connect())
            {

                // Loop through each worker request and insert it into the database
                foreach (var request in workerRequests)
                {
                    SqlCommand command = new SqlCommand("AddWorkerRequest", con);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Priority", request.priorety);
                    command.Parameters.AddWithValue("@ShiftDate", request.date);
                    command.Parameters.AddWithValue("@Type", request.Type);
                    command.Parameters.AddWithValue("@WorkerId", request.Worker_Id);
                    command.Parameters.AddWithValue("@CompanyCode", request.Company_Code);

                    command.ExecuteNonQuery();
                }
            }
            return new HttpResponseMessage(HttpStatusCode.Created)
            {
                Content = new StringContent("Worker requests created successfully")
            };
        }

        public HttpResponseMessage AddWorker(Worker worker)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand command = new SqlCommand("InsertWorker", con))
                {

                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Worker_Id", worker.Worker_Id);
                    command.Parameters.AddWithValue("@Name", worker.Name);
                    command.Parameters.AddWithValue("@Email", worker.Email);
                    command.Parameters.AddWithValue("@Start_Date", worker.Start_Date);
                    command.Parameters.AddWithValue("@Is_Manager", worker.Is_Manager);
                    command.Parameters.AddWithValue("@Company_Code", worker.Company_Code);
                    command.Parameters.AddWithValue("@Image", worker.Image);



                    int rowsAffected = (int)command.ExecuteScalar();
                    con.Close();

                    if (rowsAffected > 0)
                    {
                        return new HttpResponseMessage(HttpStatusCode.Created)
                        {
                            Content = new StringContent("Worker created successfully")
                        };
                    }
                    else
                    {
                        return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                        {
                            Content = new StringContent("Failed to create worker")
                        };
                    }
                }
            }


        }


        private SqlCommand CreateScheduleCommand(SqlConnection con, string Company_Code,int weeklyCounter)
        {
            SqlCommand command = new SqlCommand();
            command.Parameters.AddWithValue("@Company_Code", Company_Code);
            command.Parameters.AddWithValue("@weeklyCounter", weeklyCounter);
            command.CommandText = "create_schedule";
            command.Connection = con;
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.CommandTimeout = 10; // in seconds
            return command;
        }
        //Weekly_Schedule
        public Dictionary<string, Dictionary<string, List<Worker>>> WeekliShift(string Company_Code, int Week_Counter)
        {
            SqlConnection con = Connect();
            SqlCommand command = WeekliShiftCommand(con, Company_Code, Week_Counter);
            SqlDataReader dr = command.ExecuteReader(CommandBehavior.CloseConnection);
            Dictionary<string, Dictionary<string, List<Worker>>> workerSchedule = init_dictionary();
            while (dr.Read())
            {
                Worker worker = new Worker();
                try
                {
                    worker.Email = (string)dr["Email"];
                    worker.Is_Manager = Convert.ToBoolean(dr["Is_Manager"]);
                    worker.Name = (string)dr["Name"];
                    worker.Start_Date = (DateTime)dr["Start_Date"];
                    worker.Company_Code = (string)dr["Company_Code"];
                    worker.Company_Name = (string)dr["Company_Name"];

                    worker.Worker_Id = (int)dr["Worker_Id"];
                    worker.Image = (string)dr["Image"];

                }catch(Exception e)
                {

                }
                DateTime date = (DateTime)dr["Shift_date"];
                worker.Shift_Id= (int)dr["Shift_Id"];
                string type = (string)dr["Type"];

                string day = worker.GetDayOfWeek(date);
                workerSchedule[day][type].Add(worker);
                
            }
            con.Close();
            return workerSchedule;
        }
        public Dictionary<string, Dictionary<string, List<Worker>>> init_dictionary()
        {
            Dictionary<string, Dictionary<string, List<Worker>>> workerSchedule = new Dictionary<string, Dictionary<string, List<Worker>>>();
            List<string> days = new List<string>();
            List<string> type = new List<string>();
            type.Add("M");
            type.Add("E");
            type.Add("N");
            for (int i = 0; i < 7; i++)
            {
                workerSchedule[i.ToString()]= new Dictionary<string, List<Worker>>();
                foreach (string t in type)
                {
                    workerSchedule[i.ToString()][t] = new List<Worker>();
                }

            }
           


            return workerSchedule;
        }
        private SqlCommand WeekliShiftCommand(SqlConnection con, string Company_Code, int Week_Counter)
        {
            SqlCommand command = new SqlCommand();
            command.Parameters.AddWithValue("@Company_Code", Company_Code);
            command.Parameters.AddWithValue("@Week_Counter", Week_Counter);

            command.CommandText = "Weekly_Schedule";
            command.Connection = con;
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.CommandTimeout = 10; // in seconds
            return command;
        }
        public List<Worker> all_Workers(string Company_Code)
        {
            SqlConnection con = Connect();
            SqlCommand command = All_WorkersCommand(con, Company_Code);
            SqlDataReader dr = command.ExecuteReader(CommandBehavior.CloseConnection);
            List<Worker> workers = new List<Worker>();
            while (dr.Read())
            {

                Worker worker = new Worker();
                worker.Email = (string)dr["Email"];
                worker.Is_Manager = Convert.ToBoolean(dr["Is_Manager"]);
                worker.Name = (string)dr["Name"];
                worker.Start_Date = (DateTime)dr["Start_Date"];
                worker.Company_Code = (string)dr["Company_Code"];
                worker.Worker_Id = (int)dr["Worker_Id"];
                worker.Company_Name = (string)dr["Company_Name"];
                try
                {

                    worker.Image = (string)dr["Image"];
                }catch(Exception e)
                {
                   
                }
                worker.Shift_Id = -1;
                workers.Add(worker);
            }
            con.Close();
            return workers;
        }
        private SqlCommand All_WorkersCommand(SqlConnection con, string Company_Code)
        {
            SqlCommand command = new SqlCommand();
            command.Parameters.AddWithValue("@Company_Code", Company_Code);

            command.CommandText = "All_Workers";
            command.Connection = con;
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.CommandTimeout = 10; // in seconds
            return command;
        }
        public Worker user_login(Worker worker_post)
        {
            SqlConnection con = Connect();
            SqlCommand command = user_loginCommand(con, worker_post);
            SqlDataReader dr = command.ExecuteReader(CommandBehavior.CloseConnection);
            Worker worker = new Worker();
            while (dr.Read())
            {
                worker.Email = (string)dr["Email"];
                worker.Is_Manager = Convert.ToBoolean(dr["Is_Manager"]);
                worker.Name = (string)dr["Name"];
                worker.Start_Date = (DateTime)dr["Start_Date"];
                worker.Company_Code = (string)dr["Company_Code"];
                worker.Worker_Id = (int)dr["Worker_Id"];
                worker.Company_Name = (string)dr["Company_Name"];
                worker.Image = (string)dr["Image"];

            }
            con.Close();
            return worker;

        }

        

        private SqlCommand user_loginCommand(SqlConnection con, Worker worker_post)
        {
            SqlCommand command = new SqlCommand();
            command.Parameters.AddWithValue("@Worker_Id", worker_post.Worker_Id);
            command.Parameters.AddWithValue("@Company_Code", worker_post.Company_Code);

            command.CommandText = "Worker_login";
            command.Connection = con;
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.CommandTimeout = 10; // in seconds
            return command;
        }



        private SqlConnection Connect() //CONNECTION TO DB FUNCTION
        {
            // read the connection string from the web.config file
            string connectionString = WebConfigurationManager.ConnectionStrings["DBConnectionString"].ConnectionString;

            // create the connection to the db
            SqlConnection con = new SqlConnection(connectionString);

            // open the database connection
            con.Open();
            return con;

        }
    }
}