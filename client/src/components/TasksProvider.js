/* eslint-disable react/no-unused-state */
import React, { Component } from 'react'
import styled from 'styled-components'
import withTaskService from '../hoc/withTaskService'
import TasksContext from './TasksContext'

const Body = styled.div`
  background-color: ${props => props.color};
  min-height: 100vh;
`

Body.defaultProps = {
  color: '#282c34',
}

class TasksProvider extends Component {
  componentDidMount() {
    this.refetchTasks({ after: 0, first: 5 })
  }

  onRadioClick = (filter) => {
    this.setState({ filter })
  }

  refetchTasks = async ({ after, first }) => {
    const tasks = await this.props.taskService.all({ after, first })
    this.setState({
      tasks: tasks.data.tasks.payload,
      hasNextPage: tasks.data.tasks.pageInfo.hasNextPage,
    })
  }

  loadMore = async ({ after, first }) => {
    const tasks = await this.props.taskService.all({ after: Number(after), first })
    this.setState(prevState => ({
      tasks: [
        ...prevState.tasks,
        ...tasks.data.tasks.payload,
      ],
      hasNextPage: tasks.data.tasks.pageInfo.hasNextPage,
    }))
  }

  updateTask = (task) => {
    const { tasks } = this.state
    const update = tasks.map((stateTask) => {
      if (stateTask.id === task.data.updateTask.id) {
        return task.data.updateTask
      }
      return stateTask
    })

    this.setState({
      tasks: update,
    })
  }

  deleteTask = (task) => {
    const { tasks } = this.state
    this.setState({
      tasks: tasks.filter((stateTask => stateTask.id !== task.data.deleteTask.id)),
    })
  }

  getFilteredTasks = (tasks) => (
    tasks.filter((task) => {
      if (this.state.filter === 'ALL') {
        return task
      }
      return this.state.filter === task.status
    })
  )

  // eslint-disable-next-line react/sort-comp
  state = {
    tasks: [],
    hasNextPage: false,
    refetchTasks: this.refetchTasks,
    filter: 'ALL',
    getFilteredTasks: this.getFilteredTasks,
    onRadioClick: this.onRadioClick,
    loadMore: this.loadMore,
    updateTask: this.updateTask,
    deleteTask: this.deleteTask,
    createTask: this.createTask,
  }

  render() {
    return (
      <TasksContext.Provider value={this.state}>
        {this.props.children}
      </TasksContext.Provider>
    )
  }
}

export default withTaskService(TasksProvider)
