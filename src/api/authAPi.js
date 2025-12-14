import { supabase } from "./supabaseClient";

export const signUpUser = async ({ name, email, password }) => {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const { error: dbError } = await supabase
    .from("users_details")
    .insert([
      {
        id: data.user.id,
        name,
        email,
      },
    ]);

  if (dbError) throw dbError;

  return data;
};

export const signInUser = async ({ email, password }) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data;
};
