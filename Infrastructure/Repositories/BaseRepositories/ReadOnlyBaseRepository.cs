using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.IRepositories;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Repositories.BaseRepositories
{
    public abstract class ReadOnlyBaseRepository<TEntity> : IReadOnlyRepository<TEntity> where TEntity : class
    {
        protected IDatabaseService DatabaseService;

        protected ReadOnlyBaseRepository(IDatabaseService dbContext)
        {
            DatabaseService = dbContext;
        }


        public async Task<List<TEntity>> GetAllAsync(string[] includes)
        {  



            var query = DatabaseService.Set<TEntity>().AsQueryable();
            if (includes != null)
            {
                foreach (string include in includes)
                {
                    //System.Diagnostics.Debug.WriteLine("SomeText", query.ToList());
                    query = query.Include(include).AsNoTracking();
                    //System.Diagnostics.Debug.WriteLine("SomeText2", query.ToList());

                }
            }

            //System.Diagnostics.Debug.WriteLine(includes[0]);
            return await query.ToListAsync();
            //return await DatabaseService.Set<TEntity>().Include("dsdsDdsdd").ToListAsync();
        }

        public async Task<PagingResult<TEntity>> GetAllPageAsync(int skip, int take)
        {
            var totalRecords = await DatabaseService.Set<TEntity>().CountAsync();
            var entity = await DatabaseService.Set<TEntity>()
                .Skip(skip)
                .Take(take)
                .ToListAsync();
            return new PagingResult<TEntity>(entity, totalRecords);
        }

        public async Task<PagingResult<TEntity>> GetByFilter(Expression<Func<TEntity, bool>> predicate, int skip, int take, string[] includes)
        {

            var query = DatabaseService.Set<TEntity>().AsQueryable();
            if (includes != null)
            {
                foreach (string include in includes)
                {
                    //System.Diagnostics.Debug.WriteLine("SomeText", query.ToList());
                    query = query.Include(include).AsNoTracking();
                    //System.Diagnostics.Debug.WriteLine("SomeText2", query.ToList());

                }
            }


            var totalRecords = await query.Where(predicate)
                .CountAsync();
            var records = await query.Where(predicate)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
            return new PagingResult<TEntity>(records, totalRecords);
        }


        ///nu e buna asta...
        public async Task<List<TEntity>> GetByConditionsAsync(Expression<Func<TEntity, bool>> predicate, string[] includes)
        {

            var query = DatabaseService.Set<TEntity>().AsQueryable();
            if (includes != null)
            {
                foreach (string include in includes)
                {
                   // var query1 = 
                    //System.Diagnostics.Debug.WriteLine("SomeText", query.ToList());
                    query = query.Include(include).AsNoTracking();
                    //System.Diagnostics.Debug.WriteLine("SomeText2", query.ToList());

                }
            }

            //System.Diagnostics.Debug.WriteLine(includes[0]);
            return await query.Where(predicate).ToListAsync();

            //return await DatabaseService.Set<TEntity>().Where(predicate)
                           //.ToListAsync();
        }

        public async Task<TEntity> GetByIdAsync(Guid id)
        {
            return await DatabaseService.Set<TEntity>().FindAsync(id);
        }
        
    }
}
