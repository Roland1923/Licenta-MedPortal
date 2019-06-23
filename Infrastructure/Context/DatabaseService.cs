using Core.Entities;
using Microsoft.EntityFrameworkCore;
using DbContext = Microsoft.EntityFrameworkCore.DbContext;

namespace Infrastructure.Context
{
    public sealed class DatabaseService : DbContext, IDatabaseService
    {
        public DatabaseService(DbContextOptions<DatabaseService> options) : base(options)
        {
            //context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
           // Database.EnsureCreated();
        }
        
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<PatientHistory> PatientHistories { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<BloodDonor> BloodDonors { get; set; }
        public DbSet<AppointmentInterval> AppointmentIntervals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            //{
                //relationship.DeleteBehavior = DeleteBehavior.SetNull;
            //}


            //modelBuilder.Entity<Appointment>().HasOne(t => t.AppointmentInterval).WithMany(s => s.Appointments)
                //.HasForeignKey(bc => bc.AppointmentIntervalId).OnDelete(DeleteBehavior.ClientSetNull);

        }

    }
}