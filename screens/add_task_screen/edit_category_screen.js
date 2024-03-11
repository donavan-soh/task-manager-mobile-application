import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function EditCategoryScreen({ navigation, route }) {

	// ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
	const { categoryEdit } = route.params;
	const [editedCategoryName, setEditedCategoryName] = useState(categoryEdit.title);

  const editCategory = async () => {
    try {
      // Retrieve category list from AsyncStorage
			const existingCategoryListData = await AsyncStorage.getItem('categoryList');
			const categoryList = existingCategoryListData ? JSON.parse(existingCategoryListData) : [];

			// Retrieve task list data from AsyncStorage
      const existingTaskData = await AsyncStorage.getItem('taskList');
      const taskList = existingTaskData ? JSON.parse(existingTaskData) : [];

      // Find id of category to edit
			const categoryIdToEdit = categoryList.findIndex(category => category.id === categoryEdit.id);
			const categoryTaskIdToEdit = taskList.findIndex(task => task.categoryid === categoryEdit.id);

			// No category name entered
			if(editedCategoryName == "" || editedCategoryName == null) {
				Alert.alert(
					"Error",
					"Please enter a Category name",
					[
						{
							text: "Ok"
						},
					]
				);
				return
			}
			else {
				if (categoryIdToEdit !== -1) {
					// Update the category name
					const editedCategoryTitle = editedCategoryName.trim();
					const editedCategoryId = editedCategoryTitle.toLowerCase();
					const categoryNameExists = categoryList.some(item => item.id === editedCategoryId);

					// Check if category exists
					if (categoryNameExists) {
						Alert.alert(
							"Error",
							"An existing category already has the same or similar name",
							[
								{
									text: "Ok"
								},
							]
						);
					} 
					else {
						categoryList[categoryIdToEdit].title = editedCategoryTitle;
						categoryList[categoryIdToEdit].id = editedCategoryId;
						taskList[categoryTaskIdToEdit].category = editedCategoryTitle;
						taskList[categoryTaskIdToEdit].categoryid = editedCategoryId;
						// Check data 
						console.log(categoryList);
						console.log(taskList);
						// Save updated category list back to AsyncStorage
						await AsyncStorage.setItem('categoryList', JSON.stringify(categoryList));
						await AsyncStorage.setItem('taskList', JSON.stringify(taskList));
						// Category edited alert
						Alert.alert(
							"Category edited!",
							categoryEdit.title + " has been changed to " + editedCategoryName,
							[
								{
									text: "Ok"
								},
							]
						);
						// Navigate back to Add Main screen modal
						navigation.navigate("Add Main", {openCategoryModal: true});
					}
				}
			}
    } 
		catch (error) {
      console.error('Error editing category:', error);
    }
  };

	// ------------------------------ Screen ------------------------------ //
	return(
    <View style={[styles.mainContainer, {backgroundColor: "transparent"}]}>
      <View style={[styles.detailsContainer, {backgroundColor: "white", shadowColor: 'black'}]}> 
				{/* ------------------------------------------------------- New category name ------------------------------------------------------- */}
				<View style={[styles.newCategoryNameContainer, {borderColor: "lightgrey"}]}>
					<TextInput
						// Description textInput style //
						clearButtonMode="while-editing"
						// Description textInput keyboard style //
						keyboardAppearance="light"
						inputMode="text" 
						enterKeyHint="done"
						// Description textInput text //
						placeholder="Enter Category name"
						defaultValue={editedCategoryName}
						onChangeText={editedCategoryName => setEditedCategoryName(editedCategoryName)}
						// Description textInput text style //
						style={{ color: "black", fontSize: 14, }}
						textAlign="center"
					/>
				</View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={[styles.addButtonContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2", borderColor: "lightgrey"}]}
            onPress={() => editCategory()}
          >
            <Text style={[styles.addButtonText, {color: "black", fontSize: 14}]}>Edit</Text>
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
  // ------------------------------------------------------- New category name ------------------------------------------------------- //
  newCategoryNameContainer: {
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