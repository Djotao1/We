namespace TreningApp.Models
{
    public class Exercises
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string Description { get; set; }
        public int TrainingId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public Training Training { get; set; }
    }
}
