import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  forbiddenNames = ['Nouh', 'Otman']
  signupForm: FormGroup;
  get hobbiesList(){
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userdata': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.valdiateUserName.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.asyncEmailValidator),
      }),
      'gender': new FormControl(null),
      'hobbies': new FormArray([])
    });

    this.signupForm.valueChanges.subscribe(
      (value) => console.log(value)
    );

    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );

    //we can also use setValue & patchValue just like the template driven approach
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  onReset() {
    this.signupForm.reset({
      'gender': 'male'
    });
  }

  onAddHobby(){
    const hobby = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(hobby);
  }

  valdiateUserName(control: FormControl): {[s: string] : boolean} {
    if(this.forbiddenNames.indexOf(control.value) !== -1){
      return {'errorForbiddenName': true};
    }

    return null;
  }

  asyncEmailValidator(control: FormControl): Promise<any> | Observable<any> {
    const validator = new Promise(
      (resolve, reject) => {
        setTimeout(() => {
          if(control.value === 'test@test.com')
          {
            resolve({'errorInvalidEmail': true});
          }
          else{
            resolve(null);
          }

        } ,800);
      }
    );

    return validator;
  }

}
