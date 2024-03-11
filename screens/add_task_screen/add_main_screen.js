import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { Icon } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function AddMainScreen({ navigation, route }) {
  // ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
  const getData = async () => {
    try {
      // Retrieve category list data from AsyncStorage
      const existingCategoryListData = await AsyncStorage.getItem('categoryList');
      const categoryList = existingCategoryListData ? JSON.parse(existingCategoryListData) : [];
      // Set category list
      setCategoryList(categoryList);
      // Check category list
      console.log('Category List:', categoryList);

      setSelectedCategoryText();
      setTask();
      setDate(new Date);
      setTime(new Date);
      setPriorityZeroButtonColour();
      setPriorityOneButtonColour();
      setPriorityTwoButtonColour();
      setPriorityThreeButtonColour();
      setNote();
    } 
    catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    // Retrieve data from AsyncStorage on component mount
    getData();
  }, []);

  // ------------------------------------------------------- Refresh screen ------------------------------------------------------- //
  useEffect(() => {
    // Automatically refresh data when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    // Clean up the subscription when the component unmounts
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // // Retrieve data from AsyncStorage on component mount
    getData();
    // Check if we should open the modal
    if (route.params && route.params.openCategoryModal) {
      setCategoryModalVisible(true);
    }
  }, [navigation, route]);

  // ------------------------------------------------------- Add new task ------------------------------------------------------- //
  const addNewTask = async () => {
		try {
      // Retrieve task list data from AsyncStorage
      const existingTaskData = await AsyncStorage.getItem('taskList');
      const taskList = existingTaskData ? JSON.parse(existingTaskData) : [];

			if(selectedCategoryText == "" || selectedCategoryText == null) {
				Alert.alert(
					"Error",
					"Please select a category",
					[
						{
							text: "Ok"
						},
					]
				);
				return
			}
      if(useTask == "" || useTask == null) {
				Alert.alert(
					"Error",
					"Please input a task",
					[
						{
							text: "Ok"
						},
					]
				);
				return
			}
			else {
        const newTaskId = new Date().getTime() * Math.floor(Math.random() * 10000);
        const newTaskCategoryId = selectedCategoryText.toLowerCase();
        const newTaskCategory = selectedCategoryText;
        const newTask = useTask;
        const newTaskDueDate = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
        const newTaskDueTime = time.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});
        const newTaskPriority = usePriority;
        const newTaskNote = useNote;
        const newTaskSubTasks = [];
        const newTaskStatus = 0;

        const newTaskData = {
          id: newTaskId,
          categoryid: newTaskCategoryId,
          category: newTaskCategory,
          task: newTask,
          duedate: newTaskDueDate,
          duetime: newTaskDueTime,
          priority: newTaskPriority,
          note: newTaskNote,
          subtasks: newTaskSubTasks,
          status: newTaskStatus
        };

        // Check data 
        console.log(newTaskData);
        // Add new task to array
        taskList.push(newTaskData);
        // Save updated array back to AsyncStorage
        await AsyncStorage.setItem('taskList', JSON.stringify(taskList));
        // Reset input fields
        setSelectedCategoryText();
        setDate(new Date);
        setTime(new Date);
        setTask();
        setNote();
        // Navigate to Tasks Main
        navigation.navigate("Tasks Main", {filterTaskList: true});
      }
		} 
		catch(error) {
			console.error('Error adding new category:', error);
		}
  };
    	
	// ------------------------------------------------------- Category ------------------------------------------------------- //
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryText, setSelectedCategoryText] = useState()

  function categorySelectModalListContent(item) {
    setSelectedCategoryText(item.title);
    setCategoryModalVisible(false);
  };

  function categorySelectModalEditButton(item) {
    setCategoryModalVisible(false);
    navigation.navigate("Edit Category", {categoryEdit: item});
  };

  function categorySelectModalDeleteButton(item) {
    try {
      // Retrieve category list from AsyncStorage
      AsyncStorage.getItem('categoryList', (error, result) => {
        if (!error) {
          const categoryList = JSON.parse(result);
  
          // Find id of category delete
          const categoryIdToDelete = categoryList.findIndex(category => category.id === item.id);
  
          if (categoryIdToDelete !== -1) {
            // Remove category from category list
            categoryList.splice(categoryIdToDelete, 1);
            // Update state
            setCategoryList(categoryList); 
            // Clear selected category text
            setSelectedCategoryText(); 
            // Save updated category list back to AsyncStorage
            AsyncStorage.setItem('categoryList', JSON.stringify(categoryList));
            getData();
          }
        } 
        else {
          console.error('Error retrieving category list:', error);
        }
      });
      // Retrieve category list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
  
          // Find id of task to delete
          const taskIdToDelete = taskList.findIndex(task => task.categoryid === item.id);
  
          if (taskIdToDelete !== -1) {
            // Remove task from task list
            taskList.splice(taskIdToDelete, 1);
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            getData();
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  
  function categoryAddNewButton() {
    setCategoryModalVisible(false);
    navigation.navigate("Add Category");
  };

  CategoryName = ({ title, onPressList, onPressEditButton, onPressDeleteButton }) => (
    <View style={[styles.categorySelectModalList, {borderColor: "lightgrey"}]}>
      <TouchableOpacity style={[styles.categorySelectModalListContent, {borderColor: "lightgrey"}]} onPress={onPressList}>
        <Text style={[styles.categorySelectModalListContentText, {color: "black", fontSize: 14}]}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.categorySelectModalEditButton, {borderColor: "lightgrey"}]} onPress={onPressEditButton}>
        <Icon name="edit" type="antdesign" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.categorySelectModalDeleteButton, {borderColor: "lightgrey"}]} onPress={onPressDeleteButton}>
        <Icon name="delete-outline" type="MaterialIcons" size={23} color="black" />
      </TouchableOpacity>
    </View>
  );

  // ------------------------------------------------------- Task ------------------------------------------------------- //
	const [useTask, setTask] = useState();

  // ------------------------------------------------------- Date select ------------------------------------------------------- //
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [date, setDate] = useState(new Date());

  function onDateChange(event, selectedDate) {
    setDate(selectedDate);
    // Check date 
    console.log('Date:', selectedDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}));
  };

  // ------------------------------------------------------- Time select ------------------------------------------------------- //
  const [timeModalVisible, setTimeModalVisible] = useState(false)
  const [time, setTime] = useState(new Date());

  function onTimeChange(event, selectedTime) {
    setTime(selectedTime);
    // Check date & time
    console.log('Time:', selectedTime.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}));
  };

  // ------------------------------------------------------- Priority ------------------------------------------------------- //
  const [usePriority, setPriority] = useState();
  const [priorityZeroButtonColour, setPriorityZeroButtonColour] = useState("transparent");
  const [priorityOneButtonColour, setPriorityOneButtonColour] = useState("transparent");
  const [priorityTwoButtonColour, setPriorityTwoButtonColour] = useState("transparent");
  const [priorityThreeButtonColour, setPriorityThreeButtonColour] = useState("transparent");

  function priorityZeroButtonPressed() {
    setPriority(0);
    setPriorityZeroButtonColour("#E5E4E2");
    setPriorityOneButtonColour("transparent");
    setPriorityTwoButtonColour("transparent");
    setPriorityThreeButtonColour("transparent");
  }

  function priorityOneButtonPressed() {
    setPriority(1);
    setPriorityOneButtonColour("#E5E4E2");
    setPriorityZeroButtonColour("transparent");
    setPriorityTwoButtonColour("transparent");
    setPriorityThreeButtonColour("transparent");
  }

  function priorityTwoButtonPressed() {
    setPriority(2);
    setPriorityTwoButtonColour("#E5E4E2");
    setPriorityZeroButtonColour("transparent");
    setPriorityOneButtonColour("transparent");
    setPriorityThreeButtonColour("transparent");
  }

  function priorityThreeButtonPressed() {
    setPriority(3);
    setPriorityThreeButtonColour("#E5E4E2");
    setPriorityZeroButtonColour("transparent");
    setPriorityOneButtonColour("transparent");
    setPriorityTwoButtonColour("transparent");
  }

  // ------------------------------------------------------- Note ------------------------------------------------------- //
	const [useNote, setNote] = useState();

  // ------------------------------------------------------- Screen ------------------------------------------------------- //
	return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      <View style={[styles.detailsContainer, {backgroundColor: "white", shadowColor: 'black'}]}> 
        {/* ------------------------------------------------------- Category select ------------------------------------------------------- */}
        <View style={[styles.categorySelectContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={styles.categorySelectButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            {selectedCategoryText == null && (
              <Text style={[styles.categorySelectButtonText, {color: "lightgrey", fontSize: 14}]}>Select Category</Text>
            )}
            {selectedCategoryText != null && (
              <Text style={[styles.categorySelectButtonText, {color: "black", fontSize: 14}]}>{selectedCategoryText}</Text>
            )}
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={categoryModalVisible}
          >
            <View style={[styles.categorySelectModalContainer, {backgroundColor: 'white',}]}>
              <View style={[styles.categorySelectModalHeaderContainer, {backgroundColor: "#D3D3D3"}]}>
                <Text style={[styles.categorySelectModalHeaderText, {color: "black", fontSize: 14}]}>Select Category</Text>
              </View>
              <View style={styles.categorySelectModalListContainer}>
                <FlatList
                  data={categoryList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <CategoryName 
                      title={item.title} 
                      onPressList={() => categorySelectModalListContent(item)}
                      onPressEditButton={() => categorySelectModalEditButton(item)}
                      onPressDeleteButton={() => categorySelectModalDeleteButton(item)}
                    />
                  )}
                />
              </View>
              <View style={[styles.categorySelectModalButtonsContainer, {backgroundColor: "#E5E4E2"}]}>
                <TouchableOpacity
                  style={[styles.categorySelectModalBackButton, {borderColor: "lightgrey"}]} 
                  onPress={() => setCategoryModalVisible(false)}
                >
                  <Text style={[styles.categorySelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.categorySelectModalAddButton} 
                  onPress={() => categoryAddNewButton()}
                >
                  <Text style={[styles.categorySelectModalAddButtonText, {color: "black", fontSize: 14}]}>Add New</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        {/* ------------------------------------------------------- Task ------------------------------------------------------- */}
        <View style={[styles.taskandnoteContainer, {borderColor: "lightgrey"}]}>
          <TextInput
            // Task textInput style //
            clearButtonMode="while-editing"
            // Task textInput keyboard style //
            keyboardAppearance="light"
            inputMode="text" 
            enterKeyHint="done"
            // Task textInput text //
            placeholder="Enter Task"
            defaultValue={useTask}
            onChangeText={useTask => setTask(useTask)}
            // Task textInput text style //
            style={{ color: "black", fontSize: 14, }}
            textAlign="center"
          />
        </View>
        {/* ------------------------------------------------------- Date & Time select ------------------------------------------------------- */}
        <View style={[styles.dateTimeSelectContainer, {borderColor: "lightgrey"}]}>
          <View style={styles.dateTimeTextContainer}>
            <Text>Due:</Text>
          </View>
          {/* ------------------------------------------------------- Date select ------------------------------------------------------- */}
          <View style={styles.dateSelectContainer}>
            <TouchableOpacity 
              style={styles.dateSelectButton}
              onPress={() => setDateModalVisible(true)}
            >
              <Text style={[styles.dateSelectButtonText, {color: "black", fontSize: 14}]}>
                {date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={dateModalVisible}
            >
              <View style={[styles.dateSelectModalContainer, {backgroundColor: 'white',}]}>
                <View style={styles.dateSelectModalPickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="spinner"
                    textColor="black"
                    onChange={onDateChange}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.dateSelectModalAddButton, {backgroundColor: "#E5E4E2"}]} 
                  onPress={() => setDateModalVisible(false)}
                >
                  <Text style={[styles.dateSelectModalAddButtonText, {color: "black", fontSize: 14}]}>Ok</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
          {/* ------------------------------------------------------- Time select ------------------------------------------------------- */}
          <View style={[styles.timeSelectContainer, {borderColor: "lightgrey"}]}>
            <TouchableOpacity 
              style={styles.timeSelectButton}
              onPress={() => setTimeModalVisible(true)}
            >
              <Text style={[styles.timeSelectButtonText, {color: "black", fontSize: 14}]}>
                {time.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: true})}
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={timeModalVisible}
            >
              <View style={[styles.timeSelectModalContainer, {backgroundColor: 'white',}]}>
                <View style={styles.timeSelectModalPickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={time}
                    mode="time"
                    display="spinner"
                    textColor="black"
                    onChange={onTimeChange}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.timeSelectModalAddButton, {backgroundColor: "#E5E4E2"}]} 
                  onPress={() => setTimeModalVisible(false)}
                >
                  <Text style={[styles.timeSelectModalAddButtonText, {color: "black", fontSize: 14}]}>Ok</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </View>
        {/* ------------------------------------------------------- Priority ------------------------------------------------------- */}
        <View style={[styles.prioritySelectContainer, {borderColor: "lightgrey"}]}>
          <View style={styles.priorityTextContainer}>
            <Text>Priority:</Text>
          </View>
          {/* -------------------- Priority 0 -------------------- */}
          <View style={[styles.priorityZeroButtonContainer, {borderColor: "lightgrey"}]}>
            <TouchableOpacity 
              style={[styles.priorityZeroButton, {backgroundColor: priorityZeroButtonColour}]}
              onPress={ () => priorityZeroButtonPressed() }
            >
              <Text style={[styles.priorityButtonText, {color: "black", fontSize: 14}]}>-</Text>
            </TouchableOpacity>
          </View>
          {/* -------------------- Priority 1  -------------------- */}
          <View style={[styles.priorityOneButtonContainer, {borderColor: "lightgrey"}]}>
            <TouchableOpacity 
              style={[styles.priorityOneButton, {backgroundColor: priorityOneButtonColour}]}
              onPress={ () => priorityOneButtonPressed() }
            >
              <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!</Text>
            </TouchableOpacity>
          </View>
          {/* -------------------- Priority 2  -------------------- */}
          <View style={[styles.priorityTwoButtonContainer, {borderColor: "lightgrey"}]}>
            <TouchableOpacity 
              style={[styles.priorityTwoButton, {backgroundColor: priorityTwoButtonColour}]}
              onPress={ () => priorityTwoButtonPressed() }
            >
              <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!</Text>
            </TouchableOpacity>
          </View>
          {/* -------------------- Priority 3 -------------------- */}
          <View style={[styles.priorityThreeButtonContainer, {borderColor: "lightgrey"}]}>
            <TouchableOpacity 
              style={[styles.priorityThreeButton, {backgroundColor: priorityThreeButtonColour}]}
              onPress={ () => priorityThreeButtonPressed() }
            >
              <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!!</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* ------------------------------------------------------- Note ------------------------------------------------------- */}
        <View style={[styles.taskandnoteContainer, {borderColor: "lightgrey"}]}>
          <TextInput
            // Note textInput style //
            clearButtonMode="while-editing"
            // Note textInput keyboard style //
            keyboardAppearance="light"
            inputMode="text" 
            enterKeyHint="done"
            // Note textInput text //
            placeholder="Note"
            defaultValue={useNote}
            onChangeText={useNote => setNote(useNote)}
            // TaskName textInput text style //
            style={{ color: "black", fontSize: 14, }}
            textAlign="center"
          />
        </View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={styles.addContainer}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2",}]}
            onPress={() => addNewTask()}
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
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  // ------------------------------------------------------- Category select ------------------------------------------------------- //
  categorySelectContainer:{
    backgroundColor: "transparent",
    flex: 3,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // ---------------- Select button ---------------- //
  categorySelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  categorySelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  categorySelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
  },
  // Header
  categorySelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  categorySelectModalHeaderText:{
    textAlign: "center",
  },
  // Lists
  categorySelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 7,
  },
  // List
  categorySelectModalList: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034, 
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  // Content
  categorySelectModalListContent: {
    backgroundColor: "transparent",
    flex: 5,
    paddingVertical: deviceHeight * 0.0223,
  },
  categorySelectModalListContentText: {
    textAlign: "center",
  },
  // Edit button
  categorySelectModalEditButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  // Delete button
  categorySelectModalDeleteButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    marginRight: deviceWidth * 0.001,
    borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
    borderRightWidth: 1,
  },
  // ---------------- Modal Buttons ---------------- //
  categorySelectModalButtonsContainer:{
    flex: 2,
    flexDirection: "row",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  // Back button
  categorySelectModalBackButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
    borderRightWidth: 1,
  },
  categorySelectModalBackButtonText: {
    textAlign: "center",
  },
  // Add button
  categorySelectModalAddButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
  },
  categorySelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Task and Note ------------------------------------------------------- //
  taskandnoteContainer: {
		backgroundColor: "transparent",
		flex: 3,
		justifyContent: 'center',
		borderRadius: 20,
    borderBottomWidth: 1,
	},
  // ------------------------------------------------------- Date & Time select ------------------------------------------------------- //
  dateTimeSelectContainer:{
    backgroundColor: "transparent",
    flex: 3,
    flexDirection: "row",
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  dateTimeTextContainer:{
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: 'center',
    marginLeft: deviceWidth * 0.04,
  },
  // ------------------------------------------------------- Date select ------------------------------------------------------- //
  dateSelectContainer: {
    backgroundColor: "transparent",
    flex: 5,
  },
  // ---------------- Select button ---------------- //
  dateSelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  dateSelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  dateSelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
  },
  // Date picker
  dateSelectModalPickerContainer: {
    backgroundColor: "transparent",
    flex: 9,
  },
  // Add button
  dateSelectModalAddButton: {
    justifyContent: "center",
    flex: 2,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  dateSelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Time select ------------------------------------------------------- //
  timeSelectContainer: {
    backgroundColor: "transparent",
    flex: 3,
    marginRight: deviceWidth * 0.04,
    marginVertical: deviceHeight * 0.01,
    borderRadius: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  // ---------------- Select button ---------------- //
  timeSelectButton: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  timeSelectButtonText: {
    textAlign: "center",
  },
  // ---------------- Modal ---------------- //
  timeSelectModalContainer: {
    alignSelf: "center",
    marginTop: deviceHeight * 0.026,
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.74,
    borderRadius: 5,
  },
  // Time picker
  timeSelectModalPickerContainer: {
    backgroundColor: "transparent",
    flex: 9,
  },
  // Add button
  timeSelectModalAddButton: {
    justifyContent: "center",
    flex: 2,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  timeSelectModalAddButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Priority select ------------------------------------------------------- //
  prioritySelectContainer:{
    backgroundColor: "transparent",
    flex: 3,
    flexDirection: "row",
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  priorityTextContainer:{
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: 'center',
    marginLeft: deviceWidth * 0.04,
  },
  priorityButtonText: {
    textAlign: "center",
	},
  // ---------------- Priority 0 button ---------------- //
  priorityZeroButtonContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
	},
  priorityZeroButton: {
    flex: 1,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderWidth: 1,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
  // ---------------- Priority 1 button ---------------- //
  priorityOneButtonContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
	},
  priorityOneButton: {
    flex: 1,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
	},
  // ---------------- Priority 2 button ---------------- //
  priorityTwoButtonContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
	},
  priorityTwoButton: {
    flex: 1,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
	},
  // ---------------- Priority 3 button ---------------- //
  priorityThreeButtonContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    marginRight: deviceWidth * 0.04,
    marginVertical: deviceHeight * 0.005,
	},
  priorityThreeButton: {
    flex: 1,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
	},
  // ------------------------------------------------------- Add ------------------------------------------------------- //
  addContainer:{
    backgroundColor: "transparent",
    flex: 3,
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