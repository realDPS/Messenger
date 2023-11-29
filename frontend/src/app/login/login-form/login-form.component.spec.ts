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

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit username and password", () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    // On rempli le formulaire et initie le spy.
    const addSpy = spyOn(component.login, "emit").and.callThrough();
    const usernameInput = testHelper.getInput("username-input");
    const passwordInput = testHelper.getInput("password-input");
    testHelper.writeInInput(usernameInput, "username");
    testHelper.writeInInput(passwordInput, "pwd");

    // On simule le onLogin.
    component.onLogin();

    // Validation.
    expect(username!).toBe("username");
    expect(password!).toBe("pwd");
    expect(component.loginForm.valid).toBe(true);
    expect(addSpy).toHaveBeenCalled();
  });

  it("should not emit when username is not present", () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    // On rempli le formulaire et initie le spy.
    const addSpy = spyOn(component.login, "emit").and.callThrough();
    const passwordInput = testHelper.getInput("password-input");
    testHelper.writeInInput(passwordInput, "pwd");

    // On simule le onLogin.
    component.onLogin();

    // Validation.
    expect(username!).toBeUndefined();
    expect(password!).toBeUndefined();
    expect(component.loginForm.valid).toBe(false);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it("should not emit when password is not present", () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    // On rempli le formulaire et initie le spy.
    const addSpy = spyOn(component.login, "emit").and.callThrough();
    const usernameInput = testHelper.getInput("username-input");
    testHelper.writeInInput(usernameInput, "username");

    // On simule le onLogin.
    component.onLogin();

    // Validation.
    expect(username!).toBeUndefined();
    expect(password!).toBeUndefined();
    expect(component.loginForm.valid).toBe(false);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it("should not emit when both username and password are not present", () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    // On initie le spy.
    const addSpy = spyOn(component.login, "emit").and.callThrough();

    // On simule le onLogin.
    component.onLogin();

    // Validation.
    expect(username!).toBeUndefined();
    expect(password!).toBeUndefined();
    expect(component.loginForm.valid).toBe(false);
    expect(addSpy).not.toHaveBeenCalled();
  });
});
