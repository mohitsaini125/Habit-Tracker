import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddTaskModal({
  modalOpen,
  setModalOpen,
  setTasks,
  index,
}) {
  function close() {
    setModalOpen(false);
  }
  const [title, setTitle] = useState("");
  function onChange(value) {
    setTitle(value);
  }
  function submit() {
    if (!title.trim()) return;
    setTasks(function (prev) {
      const newArr = [
        ...prev,
        {
          title: title,
          isCompleted: false,
        },
      ];

      return newArr;
    });
    AsyncStorage.getItem("taskData").then(function (data) {
      const arr = JSON.parse(data);
      arr[arr.length - 1].push({
        title: title,
        isCompleted: false,
      });
      AsyncStorage.setItem("taskData", JSON.stringify(arr));
    });
    setTitle("");
    close();
  }
  function change() {
    if (!title.trim()) return;
    setTasks(function (prev) {
      const arr = prev.map((task, i) =>
        i === index ? { title: title, isCompleted: true } : task
      );
      AsyncStorage.setItem("tasks", JSON.stringify(arr));
      return arr;
    });
    setTitle("");

    close();
  }
  return (
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
        <TouchableOpacity style={styles.submit} onPress={submit}>
          <Text style={{ fontSize: 24, textAlign: "center" }}>Add Task</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={close} style={{ ...styles.cross }}>
          <Text style={{ fontSize: 24, textAlign: "center" }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
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
    backgroundColor: "#ECE2F3",
    justifyContent: "center",
    borderWidth: 1,
  },
});
