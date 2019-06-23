using Core.Entities;
using Infrastructure.Context;
using Infrastructure.Repositories.BaseRepositories;

namespace Infrastructure.Repositories
{
    public class AppointmentIntervalRepository : EditableBaseRepository<AppointmentInterval>
    {
        public AppointmentIntervalRepository(DatabaseService databaseService) : base(databaseService)
        {
        }
    }
}
