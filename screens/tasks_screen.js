import { createStackNavigator } from '@react-navigation/stack';
import { TasksMainScreen } from './tasks_screen/tasks_main_screen.js';
import { AddCategoryScreen } from './tasks_screen/add_category_screen.js';
import { EditCategoryScreen } from './tasks_screen/edit_category_screen.js';
import { AddSubtaskScreen } from './tasks_screen/add_subtask_screen.js';

export function TasksScreen() {

  const Stack = createStackNavigator();
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tasks Main" component={TasksMainScreen} options={{ title: "Tasks" }}/>
      <Stack.Screen name="Add Category" component={AddCategoryScreen}/>
      <Stack.Screen name="Edit Category" component={EditCategoryScreen}/>
      <Stack.Screen name="Add Sub-Task" component={AddSubtaskScreen}/>
    </Stack.Navigator>
  );

}