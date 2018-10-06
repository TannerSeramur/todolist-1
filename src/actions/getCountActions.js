import firebase from 'firebase';

// export function fetchSearchData(args) {
//   return async (dispatch) => {
//     // Initiate loading state
//     dispatch({
//       type: FETCH_SEARCH_DATA
//     });
//     try {
//       // Call the API
//       const result = await fetchSearchData(args.pageCount, args.itemsPerPage);
//
//      // Update payload in reducer on success
//      dispatch({
//         type: FETCH_SEARCH_SUCCESS,
//         payload: result,
//         currentPage: args.pageCount
//       });
//     } catch (err) {
//      // Update error in reducer on failure
//      dispatch({
//         type: FETCH_SEARCH_FAILURE,
//         error: err
//       });
//     }
//   };
// }

export const getCount = () => dispatch => {
  const { uid } = firebase.auth().currentUser;

  console.log('get coutng');
  try {
    firebase.database().ref(`users/${uid}/count`).on('value', snapshot => {
      console.log(snapshot.val(), 'snapshot.val');
      dispatch({
        type: 'FETCH_SUCCESS',
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
  // .catch(err => {
  //   dispatch({
  //     type: 'FETCH_TASKS_FAILURE',
  //     payload: err
  //   })
  // })
}


export const getCategories = () => (dispatch, getState) => {
  const { uid } = firebase.auth().currentUser;
  console.log('fire cat-----------');
  firebase.database().ref(`users/${uid}/categories`).once('value').then(snapshot => {
    // console.log(snapshot.val(), 'getCategories');
    dispatch({
      type: 'GET_CATEGORIES_SUCCESS',
      payload: snapshot.val() || null
    })

  }).catch(err => {
      dispatch({
        type: 'GET_CATEGORIES_FAILURE',
        payload: err
      })
  })


}

export const addCategory = title => dispatch => {
  const { uid } = firebase.auth().currentUser;

  return firebase.database().ref(`users/${uid}/categories/`).push({
    title
  }).then(() => {
    dispatch({
      type: 'ADD_CAT_SUCCESS',
      // payload: snapshot.val()
    })

    console.log('getting cat');
    dispatch(getCategories());
    console.log('got cat');
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



export const addTask = newTaskDetails => (dispatch, getState) => {
  // const { uid } = firebase.auth().currentUser;
  // const state = getState();
  // const newPostKey = firebase.database().ref(`users/${uid}/categories/${state.categories.categoryKey}/todos`).push().key;
  //
  // // Write the new post's data simultaneously in the posts list and the user's post list.
  // var updates = {};
  // // updates[`users/${uid}/count/open`] += 1;
  // // updates[`users/${uid}/categories/${categoryKey}/todos/count/open`] += 1;
  // updates[`users/${uid}/categories/${categoryKey}/todos/${newPostKey}`] = todoInfo;
  // firebase.database().ref().update(updates).then(res => {
  //   console.log(res, 'res');
  // };

}
