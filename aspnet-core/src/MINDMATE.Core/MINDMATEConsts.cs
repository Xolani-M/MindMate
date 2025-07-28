using MINDMATE.Debugging;

namespace MINDMATE
{
    public class MINDMATEConsts
    {
        public const string LocalizationSourceName = "MINDMATE";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "4106858de1e64dcc87f18f2df6ce21a0";
    }
}
