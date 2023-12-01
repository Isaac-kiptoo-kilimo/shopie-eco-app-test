///<reference types="cypress"/>

describe('should register user', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:4200/')
})

  it('Should Register User successfullly', () => {
    cy.visit('http://localhost:4200/sign');
    cy.get('[data-cy="signUpForm"]');
    cy.get('[data-cy="fullName"]').type("Noel Jepkemoi")
    cy.get('[data-cy="profileImage"]').type("assets/images/image.jpg")
    cy.get('[data-cy="registerEmail"]').type("noelajepkemoi@thejitu.com")
    cy.get('[data-cy="regPassword"]').type("12345678@Nj");
    cy.get('[data-cy="register-btn"]').click();
  });
});
