import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------------------------------- Device dimensions ------------------------------------------------------- //
// --------------- Device width --------------- //
export const deviceWidth = Dimensions.get('screen').width;
// --------------- Device height --------------- //
export const deviceHeight = Dimensions.get('screen').height;

// ------------------------------------------------------- Main function ------------------------------------------------------- //
export function AddCategoryScreen({ navigation, route }) {

	// ------------------------------------------------------- AsyncStorage ------------------------------------------------------- //
	const addNewCategory = async (newCategoryName) => {
		try {
			// Retrieve category list data from AsyncStorage
			const existingCategoryListData = await AsyncStorage.getItem('categoryList');
			const categoryList = existingCategoryListData ? JSON.parse(existingCategoryListData) : [];

			// No category name entered
			if(newCategoryName == "" || newCategoryName == null) {
				Alert.alert(
					"Error",
					"Please enter a category name",
					[
						{
							text: "Ok"
						},
					]
				);
				return
			}
			else{
				const newCategoryTitle = newCategoryName.trim();
				const newCategoryId = newCategoryTitle.toLowerCase();
				const categoryNameExists = categoryList.some(item => item.id === newCategoryId);

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
				// New category added
				else {
					const newCategoryData = {id: newCategoryId, title: newCategoryTitle};
					// Add new category to array
					categoryList.push(newCategoryData);
					// Save the updated array back to AsyncStorage
					await AsyncStorage.setItem('categoryList', JSON.stringify(categoryList));
					// Reset input field
					setNewCategoryName();
					// Navigate back to Add Main screen
					navigation.navigate("Tasks Main");
					// New category added alert
					Alert.alert(
						"New category added!",
						newCategoryTitle + " has been added to category",
						[
							{
								text: "Ok"
							},
						]
					);
				}
			}
			console.log('New category added successfully.');
		} 
		catch (error) {
			console.error('Error adding new category:', error);
		}
	};

	// ------------------------------------------------------- New category name ------------------------------------------------------- //
	const [newCategoryName, setNewCategoryName] = useState();

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
						placeholder="Enter Category"
						defaultValue={newCategoryName}
						onChangeText={newCategoryName => setNewCategoryName(newCategoryName)}
						// Description textInput text style //
						style={{ color: "black", fontSize: 14, }}
						textAlign="center"
					/>
				</View>
        {/* ------------------------------------------------------- Add ------------------------------------------------------- */}
        <View style={[styles.addButtonContainer, {borderColor: "lightgrey"}]}>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor: "#E5E4E2", borderColor: "lightgrey"}]}
            onPress={() => addNewCategory(newCategoryName)}
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