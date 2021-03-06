import firebase from 'firebase';

export const getCount = () => dispatch => {
  const { uid } = firebase.auth().currentUser;

  console.log('get coutng');
  try {
    firebase.database().ref(`users/${uid}/count`).on('value', snapshot => {
      // console.log(snapshot.val(), 'snapshot.val');
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: snapshot.val() || 0
      })
    })

    firebase.database().ref(`users/${uid}/closed`).on('value', snapshot => {
      // console.log(snapshot.val(), 'snapshot.val');
      dispatch({
        type: 'GET_CLOSED_SUCCESS',
        payload: snapshot.val() || 0
      })
    })

  }
  catch (err) {
    console.log(err, 'errorrrr');
    dispatch({
      type: 'FETCH_FAILURE',
      payload: err
    })
  }

}

export const getTasks = () => (dispatch, getState) => {
  const { uid } = firebase.auth().currentUser;
  const state = getState();
  console.log(state, "STATE IN GET TASKS -------");
  return firebase.database().ref(`users/${uid}/categories/${state.categories.categoryKey}/todos`).on('value', snapshot => {
    dispatch({
      type: 'FETCH_TASKS_SUCCESS',
      payload: snapshot.val() || {}
    })
  })
}


export const getCategories = () => (dispatch, getState) => {
  const { uid } = firebase.auth().currentUser;

  firebase.database().ref(`users/${uid}/categories`).once('value').then(snapshot => {
    dispatch({
      type: 'GET_CATEGORIES_SUCCESS',
      payload: snapshot.val() || null
    })
    console.log(getState(), 'stateeeee----------');

  }).catch(err => {
    console.log('getting categroyes cfailed');
      dispatch({
        type: 'GET_CATEGORIES_FAILURE',
        payload: err
      })
  })

}

export const addCategory = (title, iconName) => dispatch => {
  const { uid } = firebase.auth().currentUser;

  return firebase.database().ref(`users/${uid}/categories/`).push({
    title,
    count: 0,
    closed: 0,
    iconName
  }).then(() => {
    dispatch({
      type: 'ADD_CAT_SUCCESS',
    })
    dispatch(getCategories());
  }).catch(err => {
    dispatch({
      type: 'ADD_CAT_FAILURE',
      payload: err
    })
  })
}

export const addCategoryKey = key => dispatch => {
  console.log('adding key');
  return dispatch({
    type: 'ADD_CAT_KEY',
    payload: key
  })
}



export const addTask = title => (dispatch, getState) => {
  const { uid } = firebase.auth().currentUser;

  const date = new Date();
  const taskInfo = {
    date,
    completedDate: null,
    completed: false,
    title
  }


  const state = getState();
  const { allCategories, categoryKey } = state.categories;

  const newPostKey = firebase.database().ref(`users/${uid}/categories/${categoryKey}/todos`).push().key;

  var updates = {};
  updates[`users/${uid}/count/`] = state.counts.total + 1;
  updates[`users/${uid}/categories/${categoryKey}/count`] = allCategories[categoryKey].count + 1;
  updates[`users/${uid}/categories/${categoryKey}/todos/${newPostKey}`] = taskInfo;
  firebase.database().ref().update(updates).then(() => {

    dispatch({
      type: 'ADD_TASK_SUCCESS'
    })

    dispatch(getCategories());

  }).catch(err => {
    dispatch({
      type: 'ADD_TASK_FAILURE',
      payload: err
    })
  })

  // console.log(updates, 'updates');

}


export const toggleTask = key => (dispatch, getState) => {
  const { uid } = firebase.auth().currentUser;
  const state = getState();
  const { allCategories, categoryKey } = state.categories;
  // console.log('toggling');
  const task = state.tasks.payload[key];

  const date = new Date();

  const obj = {
    ...task,
    completed: !task.completed,
    completedDate: task.completed ? null : date
  }
  // console.log(obj, 'logging toggle Object');

  // console.log(allCategories[categoryKey], 'woohooooo----');
  var updates = {}
  updates[`users/${uid}/closed`] = obj.completed ? state.counts.closed + 1 : state.counts.closed - 1;
  updates[`users/${uid}/categories/${categoryKey}/closed`] =  obj.completed ? allCategories[categoryKey].closed + 1 : allCategories[categoryKey].closed - 1;
  updates[`users/${uid}/categories/${categoryKey}/todos/${key}`] = obj;

  firebase.database().ref().update(updates).then(() => {

    // console.log('update successful');
    dispatch(getCategories());

  }).catch(err => {
    dispatch({
      type: 'DELETE_TASK_FAILURE',
      payload: err
    })
  })
}



export const deleteTask = key => (dispatch, getState) => {
  const { uid } = firebase.auth().currentUser;
  const state = getState();
  const { allCategories, categoryKey } = state.categories;

  console.log(state, 'state');
  var updates = {};
  updates[`users/${uid}/count/`] = state.counts.total - 1;
  updates[`users/${uid}/closed/`] = state.counts.closed - 1;
  updates[`users/${uid}/categories/${categoryKey}/count`] = allCategories[categoryKey].count - 1;
  updates[`users/${uid}/categories/${categoryKey}/closed`] = allCategories[categoryKey].closed - 1;
  updates[`users/${uid}/categories/${categoryKey}/todos/${key}`] = null;

  firebase.database().ref().update(updates).then(() => {

    // dispatch({
    //   type: 'ADD_TASK_SUCCESS'
    // })

    dispatch(getCategories());

  }).catch(err => {
    dispatch({
      type: 'DELETE_TASK_FAILURE',
      payload: err
    })
  })

   // firebase.database().ref(`users/${uid}/categories/${state.categories.categoryKey}/todos/${key}`).set(null).then(() => {
   //   console.log('deleted');
   //   dispatch(getCategories())
   // });
}


export const updateCategoryName = title => (dispatch, getState) => {
  const { uid } = firebase.auth().currentUser;
  const state = getState();
  const { allCategories, categoryKey } = state.categories;


  const categoryDetails = {
    ...allCategories[categoryKey],
    title
  }

  console.log(categoryDetails, 'categoryDetails');

  var updates = {};
  updates[`users/${uid}/categories/${categoryKey}`] = categoryDetails;


  firebase.database().ref().update(updates).then(() => {

    // dispatch({
    //   type: 'ADD_TASK_SUCCESS'
    // })

    dispatch(getCategories());
    console.log('update title successful');

  }).catch(err => {
    dispatch({
      type: 'UPDATE_CATEGORY_FAILURE',
      payload: err
    })
  })

}

export const deleteCategory = title => (dispatch, getState) => {
  const { uid } = firebase.auth().currentUser;
  const state = getState();
  const { allCategories, categoryKey } = state.categories;

  dispatch({
    type: 'NULLIFY_TITLE',
  })

  console.log(state, 'STATE INSIDE THE DELTE HAHAHAHAHA');
  var updates = {};
  updates[`users/${uid}/count/`] = state.counts.total - allCategories[categoryKey].count;
  updates[`users/${uid}/closed/`] = state.counts.closed - allCategories[categoryKey].closed;
  updates[`users/${uid}/categories/${categoryKey}`] = null;
  firebase.database().ref().update(updates).then(() => {

    // dispatch({
    //   type: 'ADD_TASK_SUCCESS'
    // })
    console.log('deleteCategory successful');
    dispatch(getCategories());
    console.log('delete category successful');

  }).catch(err => {
    dispatch({
      type: 'DELETE_CATEGORY_FAILURE',
      payload: err
    })
  })

}
