namespace TreningApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
       
        public string Email { get; set; }
        public string Phone { get; set; }  
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PasswordHash { get; set; } // Heširana šifra
        public string PasswordSalt { get; set; } // Sol za heširanje
    }
}
