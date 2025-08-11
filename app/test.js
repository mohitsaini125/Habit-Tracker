import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
export default function Test() {
  const [taskData, setTaskData] = useState([]);
  useFocusEffect(function () {
    AsyncStorage.getItem("taskData").then(function (data) {
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setTaskData(parsed);
        } else {
          setTaskData([]);
        }
      } else {
        setTaskData([]);
      }
    });
  });

  const daysPerTasks = [];
  (taskData || []).forEach(function (day) {
    if (Array.isArray(day)) {
      const totalTasks = day.length;
      const completedTasks = day.filter((task) => task?.isCompleted).length;
      const percentage =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      daysPerTasks.push(percentage);
    } else {
      daysPerTasks.push(0); // or skip
    }
  });

  const days = [];
  taskData.forEach(function (_, index) {
    const dayName = `Day ${index + 1}`;
    days.push(dayName);
  });

  const data = {
    labels: days,
    datasets: [
      {
        data: daysPerTasks,
      },
    ],
  };
  return (
    <View>
      {/* {taskData.map(function (day, index) {
        return (
          <View key={index}>
            <Text>Day {index + 1}</Text>
            {day.map(function (task, taskIndex) {
              return (
                <View key={taskIndex}>
                  <Text>{task.title}</Text>
                  {task.isCompleted ? (
                    <Text>Completed</Text>
                  ) : (
                    <Text>Not Completed</Text>
                  )}
                </View>
              );
            })}
          </View>
        );
      })} */}
      <View style={styles.graph}>
        <Text>Bar Chart</Text>
        {days.length === 0 ? (
          <Text>No data to display</Text>
        ) : (
          <ScrollView horizontal={true}>
            <BarChart
              style={styles.graph}
              data={data}
              width={Math.max(Dimensions.get("window").width, days.length * 60)}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              verticalLabelRotation={30}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  graph: {
    marginHorizontal: "auto",
  },
});
