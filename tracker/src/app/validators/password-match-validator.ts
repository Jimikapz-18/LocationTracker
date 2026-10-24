import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(passwordField:string,confirmPasswordField:string) : ValidatorFn{
    return (formGroup : AbstractControl) : ValidationErrors|null => {
        const password = formGroup.get(passwordField)?.value as string;
        const confirmPassword = formGroup.get(confirmPasswordField)?.value as string;

        if(password !== confirmPassword){
            formGroup.get(confirmPasswordField)?.setErrors({passwordMismatch:true});
            return {passwordMismatch:true};
        }
        else{
            formGroup.get(confirmPasswordField)?.setErrors(null);
            return null;
        }
    }
}