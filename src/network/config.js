import store from '../store/index.js'

// let getUser = JSON.parse(localStorage.getItem("userInfo")) ;
// let token = ''

//    if(getUser) {
//      token = getUser.token
//    }
//  

export let loginHeader = {
  platform: "PC",
  version: "20191218",
  timestamp: Date.parse(new Date()),
}

export let header = {
  platform: "PC",
  version: "20191218",
  timestamp: Date.parse(new Date()),
  token: store.state.userInfo.token
}





