import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { useUserStore } from "./user";
import { onMounted } from "vue";

export const useTaskStore = defineStore("tasks", () => {
  const tasksArr = ref([]);

  const fetchTasks = async () => {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    tasksArr.value = tasks;
  };

  const addTask = async (title, description) => {
    const user_id = useUserStore().user.id;

    const { data, error } = await supabase.from("tasks").insert([
      {
        user_id: user_id,
        title: title,
        is_complete: false,
        description: description,
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().match({
      id: id,
    });

    await fetchTasks();
  };

  const updateTask = async (id, title, description) => {
    const { data, error } = await supabase
      .from("tasks")
      .update([
        {
          title: title,
          description: description,
        },
      ])
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    await fetchTasks();
  };

  const completeTask = async (id, booleanValue) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ is_complete: booleanValue })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    await fetchTasks();
  };

  onMounted(() => {
    fetchTasks();
  });

  return {
    tasksArr,
    fetchTasks,
    addTask,
    deleteTask,
    updateTask,
    completeTask,
  };
});
