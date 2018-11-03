import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.name == undefined ||user.email == undefined || user.password == undefined){
      return false;
    }
    else return true;
  }

  validateLogin(user){
    if(user.email == undefined || user.password == undefined){
      return false;
    }
    else return true;
  }

  validatePassword(p1, p2){
    return (p1 === p2);
  }

  validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }

}
