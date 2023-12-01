///<reference types="cypress"/>

// describe('should login user successfully', ()=>{

  
//     //  it('should display error message for invalid email',()=>{
//     //   cy.visit('http://localhost:4200/login');
//     //   cy.get('[data-cy="loginForm"]')
//     //    cy.get('[data-cy="email"]').type('isaackilimok0@gmail.com');
//     //    cy.get('[data-cy="password"]').type('12345678@iK')
//     //    cy.get('[data-cy="submit-btn"]').click();
//     //  })

//     //  it('should display error message for wrong password',()=>{
//     //   cy.visit('http://localhost:4200/login');
//     //   cy.get('[data-cy="loginForm"]')
//     //    cy.get('[data-cy="email"]').type('isaackilimok2@gmail.com');
//     //    cy.get('[data-cy="password"]').type('12345678@Ik')
//     //    cy.get('[data-cy="submit-btn"]').click();
//     //  })

//      it('Checks the login authentication', () => {
//       cy.visit('http://localhost:4200/login');
//       cy.loginUser()
//       // cy.get('[data-cy="loginForm"]')
//       // cy.get('[data-cy="email"]').type('isaackilimok2@gmail.com');
//       // cy.get('[data-cy="password"]').type('12345678@iK')
//       // cy.get('[data-cy="submit-btn"]').click();
      
//     });

    

// })


describe('Sign In Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should display the sign-in form', () => {
    cy.get('h2').should('contain.text', 'Sign in to your account');
  });

  it('should display an error for empty form submission', () => {
    cy.get('[data-cy=submit-btn]').click();
    cy.get('[data-cy=error-message-email]').should('contain.text', 'Email is required');
    cy.get('[data-cy=error-message]').should('contain.text', 'Password is required');
  });

  it('should display an error for invalid email format', () => {
    cy.get('[data-cy=email]').type('invalid-email');
    cy.get('[data-cy=submit-btn]').click();
    cy.get('[data-cy=error-message-email]').should('contain.text', 'Not a valid email');
  });

  it('should display an error for incorrect email or password', () => {
    cy.get('[data-cy=email]').type('incorrect-email@example.com');
    cy.get('[data-cy=password]').type('incorrect-password');
    cy.get('[data-cy=submit-btn]').click();
    cy.get('.error-message').should('contain.text', 'Incorrect email or password');
  });

  it('should sign in successfully with correct email and password', () => {
    cy.get('[data-cy=email]').type('isaackilimok2@gmail.com');
    cy.get('[data-cy=password]').type('12345678@iK');
    cy.get('[data-cy=submit-btn]').click();
    cy.url().should('include', '/admin'); 
  });

  it('should navigate to the sign-up page', () => {
    cy.get('a[href="/sign"]').click();
    cy.url().should('include', '/sign');
  });

  it('should navigate to the forgot password page', () => {
    cy.get('a[href="/forgot"]').click();
    cy.url().should('include', '/forgot');
  });
});
