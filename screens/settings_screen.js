import { createStackNavigator } from '@react-navigation/stack';
import { SettingsMainScreen } from './settings_screen/settings_main_screen';
import { FeedbackScreen } from './settings_screen/feedback_screen';
import { ReportAProblemScreen } from './settings_screen/report_a_problem_screen';

export function SettingsScreen() {

  const Stack = createStackNavigator();
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings Main" component={SettingsMainScreen} options={{ title: "Settings" }}/>
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="Report a problem" component={ReportAProblemScreen} />
    </Stack.Navigator>
  );

}