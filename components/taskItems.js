import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pencil, Trash } from "phosphor-react-native";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function TaskItems({
  item,
  isLastIndex,
  toggleComplete,
  items,
  set,
  setTasks,
  index,
}) {
  function updateTodaysTasks(arr) {
    AsyncStorage.getItem("taskData").then(function (data) {
      const newArr = JSON.parse(data);
      newArr[newArr.length - 1] = arr;
      AsyncStorage.setItem("taskData", JSON.stringify(newArr));
    });
  }
  function toggleComplete() {
    const arr = [...items];
    arr[index].isCompleted = !arr[index].isCompleted;
    setTasks(arr);
    updateTodaysTasks(arr);
    AsyncStorage.getItem("taskData").then(function (data) {
      const newArr = JSON.parse(data);
      newArr[newArr.length - 1] = arr;
      AsyncStorage.setItem("taskData", JSON.stringify(newArr));
    });
  }
  function deleteItem() {
    const arr = [...items];
    const filteredArr = arr.filter(function (_, i) {
      return i != index;
    });

    setTasks(filteredArr);
    updateTodaysTasks(filteredArr);
    AsyncStorage.getItem("taskData").then(function (data) {
      const newArr = JSON.parse(data);
      newArr[newArr.length - 1] = arr;
      AsyncStorage.setItem("taskData", JSON.stringify(newArr));
    });
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState(item.title || "");
  function openModal() {
    setTitle(item.title);
    setModalOpen(true);
  }
  function close() {
    setModalOpen(false);
  }
  function onChange(value) {
    setTitle(value);
  }
  function update() {
    setTasks(function (prev) {
      const arr = [...prev];
      arr[index].title = title;
      updateTodaysTasks(arr);
      AsyncStorage.getItem("taskData").then(function (data) {
        const newArr = data ? JSON.parse(data) : [[]];
        newArr[newArr.length - 1] = arr;
        AsyncStorage.setItem("taskData", JSON.stringify(newArr));
      });
    });
    setTitle("");
    close();
  }

  return (
    <View style={{ marginBottom: 20, padding: 5 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 15,
        }}
      >
        <TouchableOpacity
          style={{
            height: 25,
            aspectRatio: 1,
            borderWidth: 2.2,
            borderRadius: 100,
            borderColor: "lightgrey",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={toggleComplete}
        >
          {item.isCompleted && (
            <View
              style={{
                height: 17,
                aspectRatio: 1,
                backgroundColor: "#AFA6E6",
                borderRadius: 100,
              }}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 24 }}>{item.title}</Text>
          <View style={{ flexDirection: "row", gap: 20, right: 40 }}>
            {!item.isCompleted && (
              <TouchableOpacity onPress={openModal}>
                <Pencil size={24} color="black" />
              </TouchableOpacity>
            )}
            {!item.isCompleted && (
              <TouchableOpacity onPress={deleteItem}>
                <Trash size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {!isLastIndex && (
        <View
          style={{
            height: 1,
            backgroundColor: "lightgrey",
            marginTop: 10,
          }}
        />
      )}
      <Modal visible={modalOpen} transparent={true} style={styles.modal}>
        <View style={styles.modalview}>
          <TextInput
            style={styles.textInput}
            value={title}
            placeholder="Enter an Item here"
            weight="bold"
            padding={20}
            fontSize={24}
            onChangeText={onChange}
          />
          <TouchableOpacity style={styles.submit} onPress={update}>
            <Text style={{ fontSize: 26, textAlign: "center" }}>update</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cross} onPress={close}>
            <Text style={{ fontSize: 24, textAlign: "center" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalview: {
    height: 180,
    width: 320,
    margin: "auto",
    borderWidth: 1,
    backgroundColor: "#F6EBF9",
    boxShadow: "0px 0px 10px 0.3px grey",
    borderRadius: 40,
  },
  cross: {
    flex: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
  },
  textInput: {
    height: 80,
    backgroundColor: "#D2DEEE",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  submit: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#ECE2F3",
  },
});
