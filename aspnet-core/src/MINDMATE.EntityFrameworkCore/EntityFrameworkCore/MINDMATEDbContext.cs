using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using MINDMATE.Authorization.Roles;
using MINDMATE.Authorization.Users;
using MINDMATE.MultiTenancy;

namespace MINDMATE.EntityFrameworkCore
{
    public class MINDMATEDbContext : AbpZeroDbContext<Tenant, Role, User, MINDMATEDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public MINDMATEDbContext(DbContextOptions<MINDMATEDbContext> options)
            : base(options)
        {
        }
    }
}
