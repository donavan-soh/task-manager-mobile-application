import { ScrollView, Switch } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

export function SettingsMainScreen({ navigation }) {

  return (
    <ScrollView style={{height:"100%"}}>
      <TableView>
        <Section>
          <Cell
            title="Feedback"
            accessory="DisclosureIndicator"
            onPress={() => 
              navigation.navigate("Feedback")
            }
          />
          <Cell
            title="Report a problem"
            accessory="DisclosureIndicator"
            onPress={() => 
              navigation.navigate("Report a problem")
            }
          />
        </Section>
      </TableView>
    </ScrollView>
  )

}