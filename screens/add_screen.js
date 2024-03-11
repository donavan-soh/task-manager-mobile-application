import { createStackNavigator } from '@react-navigation/stack';
import { AddMainScreen } from './add_task_screen/add_main_screen.js';
import { AddCategoryScreen } from './add_task_screen/add_category_screen.js';
import { EditCategoryScreen } from './add_task_screen/edit_category_screen.js';


export function AddScreen() {

  const Stack = createStackNavigator();
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Add Main" component={AddMainScreen} options={{ title: "Add Task" }}/>
      <Stack.Screen name="Add Category" component={AddCategoryScreen}/>
      <Stack.Screen name="Edit Category" component={EditCategoryScreen}/>
    </Stack.Navigator>
  );

}