import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function getUser(username) {
  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function tagTrack(duration, id, mp3, showDate, title, tagId, userId, venueLocation, venueName) {
  try {
    const { data, error } = await supabase.rpc('tag_the_track', {
      p_duration: duration, // Adjusted to match the expected parameter name
      p_id: id, // Adjusted to match the expected parameter name
      p_mp3: mp3, // Adjusted to match the expected parameter name
      p_show_date: showDate, // Adjusted to match the expected parameter name
      p_title: title, // Adjusted to match the expected parameter name
      p_tag_id: tagId,
      p_user_id: userId, // Adjusted to match the expected parameter name
      p_venue_location: venueLocation, // Adjusted to match the expected parameter name
      p_venue_name: venueName // Adjusted to match the expected parameter name
    })
  } catch (error) {
    console.error("Failed to tag track:", error.message);
  }
}

export async function untagTrack(tagId, trackId) {
  try {
    const { data, error } = await supabase.rpc('untag_the_track', {
      p_tag_id: tagId,
      p_track_id: trackId
    })
  } catch (error) {
    console.error('Error removing track from tag:', error.message);
  }
}

export async function getTags(userId) {
  try {
    const { data } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
    return data
  } catch (error) {
    console.error('failed to get tags:', error)
  }
}

export async function getUserTagsWithTracks(userId) {
  try {
    const { data, error } = await supabase
    .from('user_tags_with_tracks')
    .select('*');

    if (error) {
      console.error('Failed to get user tags with tracks:', error.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to get user tags with tracks:', error);
    return [];
  }
}
