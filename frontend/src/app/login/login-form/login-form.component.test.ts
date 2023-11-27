import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { TestHelper } from "src/app/test/test-helper";

import { LoginFormComponent } from "./login-form.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("LoginFormComponent", () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let testHelper: TestHelper<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    testHelper = new TestHelper(fixture);
    fixture.detectChanges();
  });
 
 it('should emit username and password', () => {
   let username: string;
   let password: string;
 
   // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
   component.login.subscribe((event) => {
     username = event.username;
     password = event.password;
   });
 
   // À compléter
   // ...
 
   expect(username!).toBe('username');
   expect(password!).toBe('pwd');
   expect(component.loginForm.valid).toBe(true);
 });
});
