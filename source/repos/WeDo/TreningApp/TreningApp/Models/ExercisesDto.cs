namespace TreningApp.Models
{
    public class ExercisesDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int TrainingId { get; set; }
        public int UserId { get; set; }
    }
}
