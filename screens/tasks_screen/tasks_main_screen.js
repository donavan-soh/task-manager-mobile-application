import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function TasksMainScreen({ navigation, route }) {

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

      // Retrieve task list data from AsyncStorage
      const existingTaskListData = await AsyncStorage.getItem('taskList');
      const taskList = existingTaskListData ? JSON.parse(existingTaskListData) : [];
      // Check task list
      console.log('Task List:', taskList);

      // Set the selected category to the first category in the list if it exists
      // if (categoryList.length > 0) {
      //   setSelectedCategory(categoryList[0].title);
      //   filterTaskListByCategory(categoryList[0].title);
      // }
      // else {
      //   setSelectedCategory("No tasks at the moment");
      // }
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
    const unsubscribe = navigation.addListener('focus', () => {
      // Automatically refresh data when the screen is focused
      getData();
    });

    // Clean up the subscription when the component unmounts
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // // Retrieve data from AsyncStorage on component mount
    getData();
    // Check if we should open the modal
    if (route.params && route.params.filterTaskList) {
      filterTaskListByCategory(selectedCategory);
    }
  }, [navigation, route]);

  // ------------------------------------------------------- Category select ------------------------------------------------------- //
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState()

  // Category name clicked
  function categorySelectModalListContent(item) {
    setSelectedCategory(item.title);
    filterTaskListByCategory(item.title);
    setCategoryModalVisible(false);
  };

  // Category name edit
  function categorySelectModalEditButton(item) {
    setCategoryModalVisible(false);
    navigation.navigate("Edit Category", {categoryEdit: item});
  };
  
  // Category delete
  function categorySelectModalDeleteButton(item) {
    try {
      // Retrieve category list from AsyncStorage
      AsyncStorage.getItem('categoryList', (error, result) => {
        if (!error) {
          const categoryList = JSON.parse(result);
  
          // Find id of category to delete
          const categoryIdToDelete = categoryList.findIndex(category => category.id === item.id);
  
          if (categoryIdToDelete !== -1) {
            // Remove category from category list
            categoryList.splice(categoryIdToDelete, 1);
            // Update state
            setCategoryList(categoryList); 
            // Clear selected category text
            if (categoryList.length > 0) {
              setSelectedCategory(categoryList[0].title);
              filterTaskListByCategory(categoryList[0].title);
            }
            else {
              setSelectedCategory();
            }
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

  // Add new category
  function categoryAddNewButton() {
    setCategoryModalVisible(false);
    navigation.navigate("Add Category");
  };

	// ------------------------------------------------------- Task lists ------------------------------------------------------- //
  const [taskList, setTaskList] = useState([]);
  const [taskListStatusIncomplete, setTaskListStatusIncomplete] = useState([]);
  const [taskListStatusInProgress, setTaskListStatusInProgress] = useState([]);
  const [taskListStatusCompleted, setTaskListStatusCompleted] = useState([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false)

  // Filter tasks by category and tasks statuses
  const filterTaskListByCategory = (category) => {
    // Retrieve task list from AsyncStorage
    AsyncStorage.getItem('taskList', (error, result) => {
      if (!error) {
        const taskList = JSON.parse(result);
        // Filter the task list by the selected category
        const filteredTaskList = taskList.filter((task) => task.category === category);
        // Update state with the filtered task list
        setTaskList(filteredTaskList);
        // Filter the task list by status incomplete (0)
        const filteredTaskListStatusIncomplete = filteredTaskList.filter((task) => task.status === 0);
        // Update state with the filtered task list
        setTaskListStatusIncomplete(filteredTaskListStatusIncomplete);
        // Filter the task list by status in progress (1)
        const filteredTaskListStatusInProgress = filteredTaskList.filter((task) => task.status === 1);
        // Update state with the filtered task list
        setTaskListStatusInProgress(filteredTaskListStatusInProgress);
        // Filter the task list by status completed (2)
        const filteredTaskListStatusCompleted = filteredTaskList.filter((task) => task.status === 2);
        // Update state with the filtered task list
        setTaskListStatusCompleted(filteredTaskListStatusCompleted);
      } else {
        console.error('Error retrieving task list:', error);
      }
    });
  };

  // Task delete
  function taskListDeleteButton(item) {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
  
          // Find id of task to delete
          const taskIdToDelete = taskList.findIndex(task => task.id === item.id);
  
          if (taskIdToDelete !== -1) {
            // Remove task from task list
            taskList.splice(taskIdToDelete, 1);
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            // Filter the task list by the selected category
            filterTaskListByCategory(item.category);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // ------------------------------------------------------- Task Modal ------------------------------------------------------- //
  const [useTaskId, setTaskId] = useState();
  const [useTask, setTask] = useState();
  const [useDueDate, setDueDate] = useState();
  const [useDueTime, setDueTime] = useState();
  const [usePriority, setPriority] = useState();
  const [useNote, setNote] = useState();
  const [useSubTasks, setSubTasks] = useState();
  const [useStatus, setStatus] = useState();

  // Open task modal
  function openTaskModal(taskId, task, duedate, duetime, priority, note, subtasks, status) {
    setTaskId(taskId);
    setTask(task);
    setDueDate(duedate);
    setDueTime(duetime);
    setPriority(priority);
    setNote(note);
    setSubTasks(subtasks);
    setStatus(status);
    setTaskModalVisible(true);
  }

  // --------------------------------------------- Status select --------------------------------------------- //
  // Incomplete button
  function incompleteButtonPressed() {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
          //Find id of task to change status
          const taskIdToChangeStatus = taskList.findIndex(task => task.id === useTaskId);

          if (taskIdToChangeStatus !== -1) {
            // Change task status to status incomplete (0)
            taskList[taskIdToChangeStatus].status = 0;
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // In Progress button
  function inProgressButtonPressed() {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
          //Find id of task to change status
          const taskIdToChangeStatus = taskList.findIndex(task => task.id === useTaskId);

          if (taskIdToChangeStatus !== -1) {
            // Change task status to status in progress (1)
            taskList[taskIdToChangeStatus].status = 1;
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  // In Progress button
  function checkboxPressed(taskId) {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
          //Find id of task to change status
          const taskIdToChangeStatus = taskList.findIndex(task => task.id === taskId);

          if ((taskIdToChangeStatus !== -1) && (taskList[taskIdToChangeStatus].status === 0 || taskList[taskIdToChangeStatus].status === 1)) {
            // Change task status to status completed (2)
            taskList[taskIdToChangeStatus].status = 2;
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
          else {
            // Change task status to status incompleted (0)
            taskList[taskIdToChangeStatus].status = 0;
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  // --------------------------------------------- Priority select --------------------------------------------- //
  // Priority Zero button
  function priorityZeroButtonPressed() {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
          //Find id of task to change priority
          const taskIdToChangeStatus = taskList.findIndex(task => task.id === useTaskId);

          if (taskIdToChangeStatus !== -1) {
            // Change priority to priority 0
            taskList[taskIdToChangeStatus].priority = 0;
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Priority One button
  function priorityOneButtonPressed() {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
          //Find id of task to change priority
          const taskIdToChangeStatus = taskList.findIndex(task => task.id === useTaskId);

          if (taskIdToChangeStatus !== -1) {
            // Change priority to priority 1
            taskList[taskIdToChangeStatus].priority = 1;
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Priority Two button
  function priorityTwoButtonPressed() {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
          //Find id of task to change priority
          const taskIdToChangeStatus = taskList.findIndex(task => task.id === useTaskId);

          if (taskIdToChangeStatus !== -1) {
            // Change priority to priority 2
            taskList[taskIdToChangeStatus].priority = 2;
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Priority Three button
  function priorityThreeButtonPressed() {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
          //Find id of task to change priority
          const taskIdToChangeStatus = taskList.findIndex(task => task.id === useTaskId);

          if (taskIdToChangeStatus !== -1) {
            // Change priority to priority 3
            taskList[taskIdToChangeStatus].priority = 3;
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // --------------------------------------------- Sub-task --------------------------------------------- //
  // Sub-task delete
  function subTaskListDeleteButton(item) {
    try {
      // Retrieve task list from AsyncStorage
      AsyncStorage.getItem('taskList', (error, result) => {
        if (!error) {
          const taskList = JSON.parse(result);
          //Find id of task to delete subtask
          const taskIdToDelete = taskList.findIndex(task => task.id === useTaskId);
          // Find id of subtask
          const subTaskIdToDelete = taskList[taskIdToDelete].subtasks.findIndex(subtask => subtask === item);

          if (taskIdToDelete !== -1) {
            // Remove subtask from subtask list
            taskList[taskIdToDelete].subtasks.splice(subTaskIdToDelete, 1);
            // Save updated task list back to AsyncStorage
            AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskModalVisible(false);
            getData();
            filterTaskListByCategory(selectedCategory);
          }
        } 
        else {
          console.error('Error retrieving task list:', error);
        }
      });
    } 
    catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Add new sub-task
  function taskAddNewSubTaskButton() {
    setTaskModalVisible(false);
    navigation.navigate('Add Sub-Task', {
      taskId: useTaskId,
    });
    console.log(useTaskId);
  }

   // ------------------------------------------------------- Category List ------------------------------------------------------- //
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

  // ------------------------------------------------------- Task List ------------------------------------------------------- //
  TaskName = ({ taskId, task, duedate, duetime, priority, note, subtasks, status, onPressDeleteButton }) => (
    <View style={[styles.taskList, {borderColor: "lightgrey"}]}>
      {status != 2 && (
        <TouchableOpacity 
          style={[styles.taskListContentCheckboxContainer, {backgroundColor: "transparent", borderColor: "lightgrey"}]}
          onPress={ () => checkboxPressed(taskId) }
        />
      )}
      {status === 2 && (
        <TouchableOpacity 
          style={[styles.taskListContentCheckboxContainer, {backgroundColor: "lightgreen", borderColor: "lightgrey"}]}
          onPress={ () => checkboxPressed(taskId) }
        >
          <Icon name="check" type="Material" size={23} color="white" />
        </ TouchableOpacity>
      )}
      {priority === 0 && (
        <View style={styles.taskListContentPriorityContainer} />
      )}
      {priority === 1 && (
        <View style={styles.taskListContentPriorityContainer}>
          <Text style={[styles.taskListContentPriorityText, {color: "red", fontSize: 22}]}>!</Text>
        </View>
      )}
      {priority === 2 && (
        <View style={styles.taskListContentPriorityContainer}>
          <Text style={[styles.taskListContentPriorityText, {color: "red", fontSize: 22}]}>!!</Text>
        </View>
      )}
      {priority === 3 && (
        <View style={styles.taskListContentPriorityContainer}>
          <Text style={[styles.taskListContentPriorityText, {color: "red", fontSize: 22}]}>!!!</Text>
        </View>
      )}
      <TouchableOpacity 
        style={styles.taskListContent}
        onPress={() => openTaskModal(taskId, task, duedate, duetime, priority, note, subtasks, status)}
      >
        <View style={styles.taskListContentTaskContainer}>
          <Text style={[styles.taskListContentTaskText, {color: "black", fontSize: 14}]}>{task}</Text>
        </View>
        <View style={styles.taskListContentDueDateAndDueTimeContainer}>
          <View style={styles.taskListContentDueDateContainer}>
            <Text style={[styles.taskListContentDueDateText, {color: "black", fontSize: 14}]}>{duedate}</Text>
          </View>
          <View style={styles.taskListContentDueTimeContainer}>
            <Text style={[styles.taskListContentDueTimeText, {color: "black", fontSize: 14}]}>{duetime}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
          animationType="slide"
          transparent={true}
          visible={taskModalVisible}
      >
        <View style={[styles.taskSelectModalContainer, {backgroundColor: 'white',}]}>
          <View style={[styles.taskSelectModalHeaderContainer, {backgroundColor: "#D3D3D3"}]}>
            <Text style={[styles.taskSelectModalHeaderText, {color: "black", fontSize: 14}]}>{useTask}</Text>
          </View>
          <View style={styles.taskSelectModalListContainer}>
            {/* -------------------- Status incomplete -------------------- */}
            {useStatus === 0 && (
              <View style={[styles.statusContainer, {borderColor: "lightgrey"}]}>
                <View style={[styles.statusTextContainer]}>
                  <Text style={[styles.statusText]}>Status:</Text>
                </View>
                {/* -------------------- Incomplete -------------------- */}
                <View style={[styles.incompleteButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.incompleteButton, {backgroundColor: "#E5E4E2"}]}
                    onPress={ () => incompleteButtonPressed() }
                  >
                    <Text style={[styles.incompleteButtonText, {color: "black", fontSize: 14}]}>Incomplete</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- In Progress -------------------- */}
                <View style={[styles.inProgressButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.inProgressButton, {backgroundColor: "transparent"}]}
                    onPress={ () => inProgressButtonPressed() }
                  >
                    <Text style={[styles.inProgressButtonText, {color: "black", fontSize: 14}]}>In Progress</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* -------------------- Status in progress -------------------- */}
            {useStatus === 1 && (
              <View style={[styles.statusContainer, {borderColor: "lightgrey"}]}>
              <View style={[styles.statusTextContainer]}>
                <Text style={[styles.statusText]}>Status:</Text>
              </View>
              {/* -------------------- Incomplete -------------------- */}
              <View style={[styles.incompleteButtonContainer, {borderColor: "lightgrey"}]}>
                <TouchableOpacity 
                  style={[styles.incompleteButton, {backgroundColor: "transparent"}]}
                  onPress={ () => incompleteButtonPressed() }
                >
                  <Text style={[styles.incompleteButtonText, {color: "black", fontSize: 14}]}>Incomplete</Text>
                </TouchableOpacity>
              </View>
              {/* -------------------- In Progress -------------------- */}
              <View style={[styles.inProgressButtonContainer, {borderColor: "lightgrey"}]}>
                <TouchableOpacity 
                  style={[styles.inProgressButton, {backgroundColor: "#E5E4E2"}]}
                  onPress={ () => inProgressButtonPressed() }
                >
                  <Text style={[styles.inProgressButtonText, {color: "black", fontSize: 14}]}>In Progress</Text>
                </TouchableOpacity>
              </View>
            </View>
            )}
            {/* -------------------- Status completed -------------------- */}
            {useStatus === 2 && (
              <View style={[styles.statusContainer, {borderColor: "lightgrey"}]}>
              <View style={[styles.statusTextContainer]}>
                <Text style={[styles.statusText]}>Status:</Text>
              </View>
              {/* -------------------- Incomplete -------------------- */}
              <View style={[styles.incompleteButtonContainer, {borderColor: "lightgrey"}]}>
                <TouchableOpacity 
                  style={[styles.incompleteButton, {backgroundColor: "transparent"}]}
                  onPress={ () => incompleteButtonPressed() }
                >
                  <Text style={[styles.incompleteButtonText, {color: "black", fontSize: 14}]}>Incomplete</Text>
                </TouchableOpacity>
              </View>
              {/* -------------------- In Progress -------------------- */}
              <View style={[styles.inProgressButtonContainer, {borderColor: "lightgrey"}]}>
                <TouchableOpacity 
                  style={[styles.inProgressButton, {backgroundColor: "transparent"}]}
                  onPress={ () => inProgressButtonPressed() }
                >
                  <Text style={[styles.inProgressButtonText, {color: "black", fontSize: 14}]}>In Progress</Text>
                </TouchableOpacity>
              </View>
            </View>
            )}
            {/* -------------------- Priority 0 -------------------- */}
            {usePriority === 0 && (
              <View style={[styles.priorityContainer, {borderColor: "lightgrey"}]}>
                <View style={[styles.priorityTextContainer]}>
                  <Text style={[styles.priorityText]}>Priority:</Text>
                </View>
                {/* -------------------- Priority 0 button -------------------- */}
                <View style={[styles.priorityZeroButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityZeroButton, {backgroundColor: "#E5E4E2"}]}
                    onPress={ () => priorityZeroButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "black", fontSize: 14}]}>-</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 1 button -------------------- */}
                <View style={[styles.priorityOneButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityOneButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityOneButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 2 button -------------------- */}
                <View style={[styles.priorityTwoButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityTwoButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityTwoButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 3 button -------------------- */}
                <View style={[styles.priorityThreeButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityThreeButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityThreeButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* -------------------- Priority 1 -------------------- */}
            {usePriority === 1 && (
              <View style={[styles.priorityContainer, {borderColor: "lightgrey"}]}>
                <View style={[styles.priorityTextContainer]}>
                  <Text style={[styles.priorityText]}>Priority:</Text>
                </View>
                {/* -------------------- Priority 0 button -------------------- */}
                <View style={[styles.priorityZeroButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityZeroButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityZeroButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "black", fontSize: 14}]}>-</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 1 button -------------------- */}
                <View style={[styles.priorityOneButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityOneButton, {backgroundColor: "#E5E4E2"}]}
                    onPress={ () => priorityOneButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 2 button -------------------- */}
                <View style={[styles.priorityTwoButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityTwoButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityTwoButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 3 button -------------------- */}
                <View style={[styles.priorityThreeButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityThreeButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityThreeButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* -------------------- Priority 2 -------------------- */}
            {usePriority === 2 && (
              <View style={[styles.priorityContainer, {borderColor: "lightgrey"}]}>
                <View style={[styles.priorityTextContainer]}>
                  <Text style={[styles.priorityText]}>Priority:</Text>
                </View>
                {/* -------------------- Priority 0 button -------------------- */}
                <View style={[styles.priorityZeroButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityZeroButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityZeroButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "black", fontSize: 14}]}>-</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 1 button -------------------- */}
                <View style={[styles.priorityOneButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityOneButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityOneButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 2 button -------------------- */}
                <View style={[styles.priorityTwoButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityTwoButton, {backgroundColor: "#E5E4E2"}]}
                    onPress={ () => priorityTwoButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 3 button -------------------- */}
                <View style={[styles.priorityThreeButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityThreeButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityThreeButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* -------------------- Priority 3 -------------------- */}
            {usePriority === 3 && (
              <View style={[styles.priorityContainer, {borderColor: "lightgrey"}]}>
                <View style={[styles.priorityTextContainer]}>
                  <Text style={[styles.priorityText]}>Priority:</Text>
                </View>
                {/* -------------------- Priority 0 button -------------------- */}
                <View style={[styles.priorityZeroButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityZeroButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityZeroButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "black", fontSize: 14}]}>-</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 1 button -------------------- */}
                <View style={[styles.priorityOneButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityOneButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityOneButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 2 button -------------------- */}
                <View style={[styles.priorityTwoButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityTwoButton, {backgroundColor: "transparent"}]}
                    onPress={ () => priorityTwoButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!</Text>
                  </TouchableOpacity>
                </View>
                {/* -------------------- Priority 3 button -------------------- */}
                <View style={[styles.priorityThreeButtonContainer, {borderColor: "lightgrey"}]}>
                  <TouchableOpacity 
                    style={[styles.priorityThreeButton, {backgroundColor: "#E5E4E2"}]}
                    onPress={ () => priorityThreeButtonPressed() }
                  >
                    <Text style={[styles.priorityButtonText, {color: "red", fontSize: 14}]}>!!!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={[styles.dueContainer, {borderColor: "lightgrey"}]}>
              <View style={[styles.dueTextContainer]}>
                <Text style={[styles.dueText]}>Due:</Text>
              </View>
              <View style={[styles.dueDateAndTimeTextContainer]}>
                <Text style={[styles.dueDateAndTimeText]}>{useDueDate} {useDueTime}</Text>
              </View>
            </View>
            <View style={[styles.noteContainer, {borderColor: "lightgrey"}]}>
              <View style={[styles.noteTitleTextContainer]}>
                <Text style={[styles.noteTitleText]}>Note:</Text>
              </View>
              <View style={[styles.noteTextContainer]}>
                <Text style={[styles.noteText]}>{useNote}</Text>
              </View>
            </View>
            <View style={[styles.subTaskHeaderContainer, {borderColor: "lightgrey"}]}>
              <View style={[styles.subTaskTitleTextContainer]}>
                <Text style={[styles.subTaskTitleText]}>Sub-Tasks</Text>
              </View>
            </View>
            <View style={styles.subTaskListsContainer}>
              <FlatList
                data={useSubTasks}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <SubTaskName 
                    subtask={item} 
                    onPressDeleteButton={() => subTaskListDeleteButton(item)}
                  />
                )}
              />
            </View>
          </View>
          <View style={[styles.taskSelectModalButtonsContainer, {backgroundColor: "#E5E4E2"}]}>
            <TouchableOpacity
              style={[styles.taskSelectModalBackButton, {borderColor: "lightgrey"}]} 
              onPress={() => setTaskModalVisible(false)}
            >
              <Text style={[styles.taskSelectModalBackButtonText, {color: "black", fontSize: 14}]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.taskSelectModalAddNewSubTaskButton} 
              onPress={() => taskAddNewSubTaskButton()}
            >
              <Text style={[styles.taskSelectModalAddNewSubTaskButtonText, {color: "black", fontSize: 14}]}>Add New Sub-Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={[styles.taskListDeleteButton, {borderColor: "lightgrey"}]} onPress={onPressDeleteButton}>
        <Icon name="delete-outline" type="MaterialIcons" size={23} color="black" />
      </TouchableOpacity>
    </View>
  );
  
  // ------------------------------------------------------- Sub-task List ------------------------------------------------------- //
  SubTaskName = ({ subtask, onPressDeleteButton }) => (
    <View style={[styles.subTaskList, {borderColor: "lightgrey"}]}>
      <View style={styles.subTaskListContentTaskContainer}>
        <Text style={[styles.subTaskListContentTaskText, {color: "black", fontSize: 14}]}>{subtask}</Text>
      </View>
      <TouchableOpacity style={[styles.subTaskListDeleteButton, {borderColor: "lightgrey"}]} onPress={onPressDeleteButton}>
        <Icon name="delete-outline" type="MaterialIcons" size={23} color="black" />
      </TouchableOpacity>
    </View>
  );
  
  // ------------------------------------------------------- Screen ------------------------------------------------------- //
  return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      {/* ------------------------------------------------------- Category select ------------------------------------------------------- */}
      <View style={[styles.categorySelectContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={styles.categorySelectButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            {selectedCategory == null && (
              <Text style={[styles.categorySelectButtonText, {color: "black", fontSize: 14}]}>Select Category</Text>
            )}
            {selectedCategory != null && (
              <Text style={[styles.categorySelectButtonText, {color: "black", fontSize: 14}]}>{selectedCategory}</Text>
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
      {/* ------------------------------------------------------- Task lists ------------------------------------------------------- */}
      {selectedCategory == null && (
        <View style={styles.taskListsContainer}></View>
      )}
      {selectedCategory != null && (
        <View style={styles.taskListsContainer}>
          <View style={styles.statusTitleContainer}>
            <Text style={styles.statusTitleText}>Incomplete</Text>
          </View>
          <View style={styles.taskListContainer}>
            <FlatList
              data={taskListStatusIncomplete}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskName 
                  taskId={item.id}
                  task={item.task} 
                  duedate={item.duedate}
                  duetime={item.duetime}
                  priority={item.priority}
                  note={item.note}   
                  subtasks={item.subtasks}
                  status={item.status}
                  onPressDeleteButton={() => taskListDeleteButton(item)}
                />
              )}
            />
          </View>
          <View style={styles.statusTitleContainer}>
            <Text style={styles.statusTitleText}>In Progress</Text>
          </View>
          <View style={styles.taskListContainer}>
            <FlatList
              data={taskListStatusInProgress}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskName 
                  taskId={item.id}
                  task={item.task} 
                  duedate={item.duedate}
                  duetime={item.duetime}
                  priority={item.priority}
                  note={item.note}   
                  subtasks={item.subtasks}
                  status={item.status}
                  onPressDeleteButton={() => taskListDeleteButton(item)}
                />
              )}
            />
          </View>
          <View style={styles.statusTitleContainer}>
            <Text style={styles.statusTitleText}>Completed</Text>
          </View>
          <View style={styles.taskListContainer}>
            <FlatList
              data={taskListStatusCompleted}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskName 
                  taskId={item.id}
                  task={item.task} 
                  duedate={item.duedate}
                  duetime={item.duetime}
                  priority={item.priority}
                  note={item.note}   
                  subtasks={item.subtasks}
                  status={item.status}
                  onPressDeleteButton={() => taskListDeleteButton(item)}
                />
              )}
            />
          </View>
        </View>
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  // ------------------------------------------------------- Main container ------------------------------------------------------- //
	mainContainer: {
    flex: 1,
  },
  // ------------------------------------------------------- Category select ------------------------------------------------------- //
  categorySelectContainer:{
    flex: 1,
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
  // ---------------- Category Modal ---------------- //
  categorySelectModalContainer: {
    alignSelf: "center",
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
  // ------------------------------------------------------- Tasks list ------------------------------------------------------- //
  // Lists
  taskListsContainer: {
    backgroundColor: "white",
    flex: 14,
    flexDirection: "column",
  },
  // Status title
  statusTitleContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: deviceWidth * 0.034,
  },
  statusTitleText: {
    textAlign: "left",
    fontSize: 20,
  },
  // List
  taskListContainer:{
    backgroundColor: "transparent",
    flex: 5,
  },
  taskList: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034, 
    borderRadius: 20,
    borderBottomWidth: 1
  },
  // Checkbox
  taskListContentCheckboxContainer: {
    flex: 2,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.0165,
    borderRadius: 30,
    borderWidth: 1,
  },
  //Priority
  taskListContentPriorityContainer: {
    backgroundColor: "transparent",
    flex: 2,
    justifyContent: "center",
    paddingLeft: deviceWidth * 0.02,
  },
  taskListContentPriorityText: {
    textAlign: "center",
  },
  // Contents
  taskListContent: {
    backgroundColor: "transparent",
    flex: 25,
    flexDirection: "row",
    height: deviceHeight * 0.06,
    paddingLeft: deviceWidth * 0.02,
    paddingRight: deviceWidth * 0.02,
  },
  // Task
  taskListContentTaskContainer: {
    backgroundColor: "transparent",
    flex: 6,
    justifyContent: "center",
  },
  taskListContentTaskText: {
    textAlign: "left",
  },
  // Due date and due time
  taskListContentDueDateAndDueTimeContainer: {
    backgroundColor: "transparent",
    flex: 4,
    flexDirection: "column",
  },
  // Due date
  taskListContentDueDateContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: 'flex-end',
  },
  taskListContentDueDateText: {
    textAlign: "right",
  },
  // Due time
  taskListContentDueTimeContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "flex-start",
  },
  taskListContentDueTimeText: {
    textAlign: "right",
  },
  // Delete button
  taskListDeleteButton: {
    backgroundColor: "transparent",
    flex: 3,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    marginRight: deviceWidth * 0.001,
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  // ---------------- Task Modal ---------------- //
  taskSelectModalContainer: {
    alignSelf: "center",
    height: deviceHeight * 0.5,
    width: deviceWidth * 0.74,
    borderRadius: 5,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  // Header
  taskSelectModalHeaderContainer:{
    justifyContent: "center",
    flex: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  taskSelectModalHeaderText:{
    textAlign: "center",
  },
  // Lists
  taskSelectModalListContainer: {
    backgroundColor: "transparent",
    flex: 13,
  },
  // ---------------- Modal Buttons ---------------- //
  taskSelectModalButtonsContainer:{
    flex: 2,
    flexDirection: "row",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  // Back button
  taskSelectModalBackButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
    borderRightWidth: 1,
  },
  taskSelectModalBackButtonText: {
    textAlign: "center",
  },
  // Add New Sub-Task button
  taskSelectModalAddNewSubTaskButton: {
    backgroundColor: "transparent",
    justifyContent: "center",
    flex: 1,
  },
  taskSelectModalAddNewSubTaskButtonText: {
    textAlign: "center",
  },
  // ------------------------------------------------------- Status select ------------------------------------------------------- //
  statusContainer:{
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  statusTextContainer:{
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  statusText:{
    textAlign: "right",
  },
  // ---------------- Incomplete button ---------------- //
  incompleteButtonContainer: {
    backgroundColor: "transparent",
    flex: 2,
    justifyContent: "center",
    paddingLeft: deviceWidth * 0.06,
    marginVertical: deviceHeight * 0.005,
	},
  incompleteButton: {
    flex: 1,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderWidth: 1,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	incompleteButtonText: {
    textAlign: "center",
	},
  // ---------------- In Progress button ---------------- //
	inProgressButtonContainer: {
    backgroundColor: "transparent",
    flex: 2,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
	},
  inProgressButton: {
    flex: 1,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
	},
	inProgressButtonText: {
    textAlign: "center",
	},
  // ------------------------------------------------------- Priority select ------------------------------------------------------- //
  priorityContainer:{
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  priorityTextContainer:{
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  priorityText:{
    textAlign: "right",
  },
  priorityButtonText: {
    textAlign: "center",
	},
  // ---------------- Priority 0 button ---------------- //
  priorityZeroButtonContainer: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    paddingLeft: deviceWidth * 0.06,
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
    marginVertical: deviceHeight * 0.005,
	},
  priorityThreeButton: {
    flex: 1,
    justifyContent: "center",
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
    borderColor: "lightgrey",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
	},
  // ------------------------------------------------------- Due ------------------------------------------------------- //
  dueContainer:{
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  dueTextContainer:{
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  dueText:{
    textAlign: "right",
  },
  // ---------------- Due Date and Time---------------- //
  dueDateAndTimeTextContainer:{
    backgroundColor: "transparent",
    flex: 4,
    justifyContent: "center",
    paddingLeft: deviceWidth * 0.06,
  },
  dueDateAndTimeText:{
    textAlign: "left",
  },
  // ------------------------------------------------------- Note ------------------------------------------------------- //
  noteContainer:{
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  noteTitleTextContainer:{
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  noteTitleText:{
    textAlign: "right",
  },
  // ---------------- Note ---------------- //
  noteTextContainer:{
    backgroundColor: "transparent",
    flex: 4,
    justifyContent: "center",
    paddingLeft: deviceWidth * 0.06,
  },
  noteText:{
    textAlign: "left",
  },
  // ------------------------------------------------------- Sub-Tasks ------------------------------------------------------- //
  // ---------------- Header ---------------- //
  subTaskHeaderContainer:{
    backgroundColor: "transparent",
    flex: 1,
    paddingHorizontal: deviceWidth * 0.034,
    borderRadius: 20,
    borderBottomWidth: 1,
  },
  subTaskTitleTextContainer:{
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  subTaskTitleText:{
    textAlign: "center",
  },
  // ---------------- Sub-Tasks list ---------------- //
  // Lists
  subTaskListsContainer: {
    backgroundColor: "transparent",
    flex: 3,
  },
  // List
  subTaskList: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: deviceWidth * 0.034, 
    borderRadius: 20,
    borderBottomWidth: 1
  },
  // Task
  subTaskListContentTaskContainer: {
    backgroundColor: "transparent",
    flex: 25,
    justifyContent: "center",
    paddingLeft: deviceWidth * 0.03,
  },
  subTaskListContentTaskText: {
    textAlign: "left",
  },
  // Delete button
  subTaskListDeleteButton: {
    backgroundColor: "transparent",
    flex: 3,
    justifyContent: "center",
    marginVertical: deviceHeight * 0.005,
    marginRight: deviceWidth * 0.001,
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
});