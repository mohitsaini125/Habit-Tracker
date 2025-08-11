import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { PlusIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import AddTaskModal from "../components/addTaskModal";
import TaskItems from "../components/taskItems";
import { days, months } from "../lib/constants";

function getsuffix(day) {
  if (day === 1 || day === 21 || day === 31) return "st";
  if (day === 2 || day === 22) return "nd";
  if (day === 3 || day === 23) return "rd";
  return "th";
}
export default function HomePage() {
  const now = new Date();
  const month = now.getMonth();
  const date = now.getDate();
  const day = now.getDay();

  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  useEffect(function () {
    AsyncStorage.getItem("taskData").then(function (data) {
      if (data) {
        const taskData = JSON.parse(data);
        if (Array.isArray(taskData) && taskData.length > 0) {
          setTasks(taskData[taskData.length - 1] || []);
        } else {
          setTasks([]);
          AsyncStorage.setItem("taskData", JSON.stringify([[]]));
        }
      } else {
        setTasks([]);
        AsyncStorage.setItem("taskData", JSON.stringify([[]]));
      }
    });
  }, []);
  function openModal() {
    setModalOpen(true);
  }
  let compl = 0;
  let incompl = 0;
  tasks?.forEach((task) => {
    if (task.isCompleted) compl += 1;
    else incompl += 1;
  });
  let totalTasks = 10;
  if (tasks.length > 0) totalTasks = tasks.length;
  else totalTasks = 1;
  const completed = tasks.filter((task) => task.isCompleted).length;
  const perc = (completed / totalTasks) * 100;
  const percentage = Number.isInteger(perc) ? perc : perc.toFixed(2);
  function startNewDay() {
    const arr = [...tasks];
    arr?.forEach(function (task) {
      task.isCompleted = false;
    });
    setTasks(arr);
    AsyncStorage.getItem("taskData").then(function (data) {
      const newArr = JSON.parse(data);
      newArr.push(arr);
      AsyncStorage.setItem("taskData", JSON.stringify(newArr));
    });
  }
  return (
    <View style={styles.mainview}>
      <View style={styles.view1}>
        <Text
          style={{
            fontSize: 44,
          }}
        >
          {date}
          {getsuffix(date)} {months[month]}
        </Text>
        <Text style={{ fontSize: 18, color: "grey" }}>{days[day]}</Text>
      </View>
      <View style={styles.bar1}>
        <LinearGradient
          colors={["#2d0076", "#c64bcf"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ ...styles.bar2, width: `${percentage}%` }}
        >
          {compl > 0 && <View style={styles.disc} />}
        </LinearGradient>
      </View>
      <View style={styles.completion}>
        <Text style={styles.progressText}>{percentage}% Completed</Text>
      </View>
      <TouchableHighlight
        underlayColor={"purple"}
        style={{ ...styles.addButton, zIndex: 1 }}
        onPress={openModal}
      >
        <View>
          <PlusIcon size={24} weight="bold" color="white" />
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.newDay} onPress={startNewDay}>
        <View style={styles.hexagon}>
          <Text style={{ fontSize: 16, fontWeight: 700, color: "white" }}>
            New
          </Text>
        </View>
      </TouchableHighlight>
      {incompl > 0 && (
        <ScrollView
          style={{ height: incompl > 3 ? 300 : "auto", borderRadius: 40 }}
        >
          <View style={{ ...styles.container }}>
            {tasks.map((item, i) => {
              if (!item.isCompleted)
                return (
                  <TaskItems
                    key={i}
                    item={item}
                    isLastIndex={tasks.length - 1 === i}
                    items={tasks}
                    index={i}
                    setTasks={setTasks}
                    openModal={openModal}
                    setModalOpen={setModalOpen}
                    title={item.title}
                  />
                );
            })}
          </View>
        </ScrollView>
      )}
      {compl > 0 && (
        <Text
          style={{
            marginTop: 20,
            marginBottom: 10,
            marginLeft: 26,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Completed
        </Text>
      )}
      {compl > 0 && (
        <ScrollView style={{ height: compl > 3 ? 250 : " auto" }}>
          <View style={{ ...styles.completed }}>
            {tasks.map((item, i) => {
              if (item.isCompleted)
                return (
                  <TaskItems
                    key={i}
                    item={item}
                    isLastIndex={tasks.length - 1 === i}
                    setTasks={setTasks}
                    items={tasks}
                    index={i}
                    openModal={openModal}
                    setModalOpen={setModalOpen}
                  />
                );
            })}
          </View>
        </ScrollView>
      )}
      <AddTaskModal
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        setTasks={setTasks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainview: {
    backgroundColor: "#FAF2FC",
    width: "100%",
    height: "100%",
  },
  view1: {
    position: "absolute",
    top: 30,
    left: 20,
  },
  bar1: {
    backgroundColor: "white",
    height: 20,
    width: "90%",
    marginTop: 140,
    marginHorizontal: "auto",
    borderRadius: 100,
  },
  bar2: {
    backgroundColor: "purple",
    height: 20,
    borderRadius: 100,
    alignItems: "flex-end",
  },
  disc: {
    height: "90%",
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: "white",
    right: 1,
    top: 1,
    bottom: 1,
  },
  progressText: {
    textAlign: "right",
    marginRight: 20,
    fontWeight: 600,
    fontSize: 16,
  },
  completion: {
    marginTop: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: "50%",
    backgroundColor: "#AFA6E6",
    width: 60,
    aspectRatio: 1,
    borderRadius: "100%",
    marginBottom: 15,
    justifyContent: "center",
    boxShadow: "0px 0px 10px 0.3px grey",
    alignItems: "center",
    transform: [
      {
        translateX: "50%",
      },
      {
        scale: 1.25,
      },
    ],
  },
  newDay: {
    position: "absolute",
    bottom: 30,
    right: "10%",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    zIndex: 1,
  },
  hexagon: {
    boxShadow: "0px 0px 10px 0.3px grey",
    height: 45,
    width: 45,
    borderRadius: 20,
    backgroundColor: "#AFA6E6",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 40,
    paddingBottom: 0,
    // height: 100,
    // boxShadow: "0px 0px 2px 1px black",
  },
  completed: {
    marginTop: 15,
    marginHorizontal: 20,
  },
});
