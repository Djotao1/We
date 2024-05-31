namespace TreningApp.Models
{
    public class TrainingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ExerciseType { get; set; }
        public int Duration { get; set; }
        public int Calories { get; set; }
        public int Intensity { get; set; }
        public int Fatigue { get; set; }
        public string Notes { get; set; }
        public DateTime TrainingDate { get; set; }
    }
}
