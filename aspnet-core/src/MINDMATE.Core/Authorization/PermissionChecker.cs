using Abp.Authorization;
using MINDMATE.Authorization.Roles;
using MINDMATE.Authorization.Users;

namespace MINDMATE.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
