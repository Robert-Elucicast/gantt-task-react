import { BarTask } from "../types/bar-task";
import { Task } from "../types/public-types";

export function isKeyboardEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.KeyboardEvent {
  return (event as React.KeyboardEvent).key !== undefined;
}

export function isMouseEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.MouseEvent {
  return (event as React.MouseEvent).clientX !== undefined;
}

export function isBarTask(task: Task | BarTask): task is BarTask {
  return (task as BarTask).x1 !== undefined;
}

export function removeHiddenTasks(tasks: readonly Task[]) {
  let res = [...tasks];

  const groupedTasks = res.filter(
    t => t.hideChildren && t.type === "project"
  );
  if (groupedTasks.length > 0) {
    for (let i = 0; groupedTasks.length > i; i++) {
      const groupedTask = groupedTasks[i];
      const children = getChildren(res, groupedTask);
      res = res.filter(t => children.indexOf(t) === -1);
    }
  }
  return res;
}

function getChildren(taskList: readonly Task[], task: Task) {
  let tasks: Task[] = [];

  const {
    id,
    comparisonLevel = 1,
  } = task;

  switch (task.type) {
    case "project":
      tasks = taskList.filter(({
        parent,
        comparisonLevel: otherComparisonLevel = 1,
      }) => (parent && parent === id) && (comparisonLevel === otherComparisonLevel));
      break;

    default:
      tasks = taskList.filter(({
        dependencies,
        comparisonLevel: otherComparisonLevel = 1,
      }) => dependencies
        && dependencies.some(({ sourceId }) => sourceId === task.id)
        && comparisonLevel === otherComparisonLevel);
      break;
  }

  var taskChildren: Task[] = [];
  tasks.forEach(t => {
    taskChildren.push(...getChildren(taskList, t));
  })
  tasks = tasks.concat(tasks, taskChildren);
  return tasks;
}

export const sortTasks = (taskA: Task, taskB: Task) => {
  const orderA = taskA.displayOrder || Number.MAX_VALUE;
  const orderB = taskB.displayOrder || Number.MAX_VALUE;
  if (orderA > orderB) {
    return 1;
  } else if (orderA < orderB) {
    return -1;
  } else {
    return 0;
  }
};
