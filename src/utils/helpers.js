export function formatDuration(duration) {
  const hours = Math.floor(duration / 3600000); // Convert milliseconds to hours
  const minutes = Math.floor((duration % 3600000) / 60000); // Remaining milliseconds converted to minutes
  const seconds = Math.floor(((duration % 3600000) % 60000) / 1000); // Remaining milliseconds converted to seconds
  
  const hoursFormatted = hours < 10? `${hours}` : `${hours.toString().padStart(2, '0')}`;

  let timeString = '';
  if (hours > 0) {
    timeString += `${hoursFormatted}:`;
  }

  timeString += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return timeString;
}