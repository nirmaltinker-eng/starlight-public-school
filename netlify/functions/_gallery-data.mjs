export const defaultGalleryItems = [
  ['environment-project-2025','environment-project-2025.jpg','Environment Project','Batch 2025','2025'],
  ['map-project-2025','map-project-2025.jpg','Map Project','Batch 2025','2025'],
  ['republic-day-group-2024','republic-day-group-2024.jpg','Republic Day Celebration','Batch 2024','2024'],
  ['republic-day-presentation-2024','republic-day-presentation-2024.jpg','Republic Day Presentation','Batch 2024','2024'],
  ['classroom-learning-2024','classroom-learning-2024.jpg','Classroom Learning','Batch 2024','2024'],
  ['eco-club-2024','eco-club-2024.jpg','Eco Club Activity','Batch 2024','2024'],
  ['plantation-drive-2024','plantation-drive-2024.jpg','Plantation Drive','Batch 2024','2024'],
  ['indoor-sports-2024','indoor-sports-2024.jpg','Indoor Sports','Batch 2024','2024'],
  ['sports-participation-2024','sports-participation-2024.jpg','Sports Participation','Batch 2024','2024'],
  ['science-models-2023','science-models-2023.jpg','Science Models','Batch 2023','2023'],
  ['solar-system-project-2023','solar-system-project-2023.jpg','Solar System Project','Batch 2023','2023'],
  ['craft-exhibition-2023','craft-exhibition-2023.jpg','Craft Exhibition','Batch 2023','2023'],
  ['creative-activity-2023','creative-activity-2023.jpg','Creative Activity','Batch 2023','2023'],
  ['educational-trip-2023','educational-trip-2023.jpg','Educational Trip','Batch 2023','2023'],
  ['school-community-2023','school-community-2023.jpg','School Community','Batch 2023','2023'],
  ['student-celebration-2023','student-celebration-2023.jpg','Student Celebration','Batch 2023','2023'],
  ['student-group-2023','student-group-2023.jpg','Student Group','Batch 2023','2023']
].map(([id,fileName,caption,batch,folder],order)=>({id,fileName,caption,batch,folder,order,active:true,custom:false,src:`gallery-assets/${fileName}`}));
