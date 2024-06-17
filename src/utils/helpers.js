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

export const tags = [
  {id: 0, abbr: 'epicness', name: 'Epicness', emoji: '🤌🏼'},
  {id: 1, abbr: 'bliss', name: 'Bliss', emoji: '🫶🏼'},
  {id: 2, abbr: 'soaring', name: 'Soaring', emoji: '🦅'},
  {id: 3, abbr: 'groovy', name: 'Groovy', emoji: '🕺🏼'},
  {id: 4, abbr: 'dark', name: 'Dark', emoji: '😈'},
  {id: 5, abbr: 'space', name: 'Ambient/Space', emoji: '👩🏼‍🚀'},
  {id: 6, abbr: 'rage', name: 'Rage', emoji: '🤘🏼'},
  {id: 7, abbr: 'melodious', name: 'Melodious', emoji: '🎶'},
  {id: 8, abbr: 'psychedelic', name: 'Psychedelic', emoji: '🪬'},
]