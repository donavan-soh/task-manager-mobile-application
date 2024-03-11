import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function AddSubtaskScreen({ navigation, route }) {

  const { taskId } = route.params;
	// ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //

  const getData = async () => {
    try {
      // Retrieve task list data from AsyncStorage
			const existingTaskListData = await AsyncStorage.getItem('taskList');
			const taskList = existingTaskListData ? JSON.parse(existingTaskListData) : [];
      // Set task list
      setTaskList(taskList);
    }
    catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    // Retrieve data from AsyncStorage on component mount
    getData();
  }, []);

  const [taskList, setTaskList] = useState([]);
  
  function addNewSubtask(newSubtaskName) {
    // No subtask name entered
    if(newSubtaskName == "" || newSubtaskName == null) {
      Alert.alert(
        "Error",
        "Please enter a sub-task",
        [
          {
            text: "Ok"
          },
        ]
      );
      return
    }
    else{
      // Find id of task to add subtask
      const taskIndexToAddSubtask = taskList.findIndex(task => task.id === taskId);
      if (taskIndexToAddSubtask !== -1) {
        // Make a copy of the taskList array
        const updatedTaskList = [...taskList];
        // Add the new subtask to the appropriate task
        updatedTaskList[taskIndexToAddSubtask].subtasks.push(newSubtaskName);
        // Update the state with the new taskList
        setTaskList(updatedTaskList);
        // Save the updated array back to AsyncStorage
        AsyncStorage.setItem('taskList', JSON.stringify(updatedTaskList));
        // Reset input field
        setNewSubtaskName();
        // Navigate back to Add Main screen
        navigation.navigate("Tasks Main", {filterTaskList: true});
        // New subtask added alert
        Alert.alert(
          "New sub-task added!",
          newSubtaskName + " has been added to sub-tasks",
          [
            {
              text: "Ok"
            },
          ]
        );
      }
    }
	};

	// ------------------------------------------------------- New subtask name ------------------------------------------------------- //
	const [newSubtaskName, setNewSubtaskName] = useState();

	// ------------------------------ Screen ------------------------------ //
	return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      <View style={[styles.detailsContainer, {backgroundColor: "white", shadowColor: 'black'}]}> 
				{/* ------------------------------------------------------- New subtask name ------------------------------------------------------- */}
				<View style={[styles.newSubtaskNameContainer, {borderColor: "lightgrey"}]}>
					<TextInput
						// Description textInput style //
						clearButtonMode="while-editing"
						// Description textInput keyboard style //
						keyboardAppearance="light"
						inputMode="text" 
						enterKeyHint="done"
						// Description textInput text //
						placeholder="Enter Sub-Task"
						defaultValue={newSubtaskName}
						onChangeText={newSubtaskName => setNewSubtaskName(newSubtaskName)}
						// Description textInput text style //
						style={{ color: "black", fontSize: 14, }}
						textAlign="center"
					/>
				</View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={[styles.addButtonContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2", borderColor: "lightgrey"}]}
            onPress={() => addNewSubtask(newSubtaskName)}
          >
            <Text style={[styles.addButtonText, {color: "black", fontSize: 14}]}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ------------------------------------------------------- Main container ------------------------------------------------------- //
	mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // ------------------------------------------------------- Details container ------------------------------------------------------- //
  detailsContainer: {
    flexDirection: "column",
    height: deviceHeight * 0.10,
    width: deviceWidth * 0.65,
    borderRadius: 5,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  // ------------------------------------------------------- New subtask name ------------------------------------------------------- //
  newSubtaskNameContainer: {
		backgroundColor: "transparent",
		flex: 1,
		justifyContent: 'center',
		borderRadius: 20,
		borderBottomWidth: 1,
	},
	// ------------------------------------------------------- Add button ------------------------------------------------------- //
	addButtonContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },
  addButton: {
		flex: 1,
		justifyContent: "center",
		borderRadius: 5,
		marginVertical: deviceHeight * 0.005,
    marginHorizontal: deviceWidth * 0.034,
  },
  addButtonText: {
    textAlign: "center",
  },
});