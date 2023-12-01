describe('Navigation', ()=>{

    it('should navigate back and forth', ()=>{
        
        cy.loginUser()

        cy.location('pathname').should('equal', 'http://localhost:4200/login')

        cy.go('back')

        cy.location('pathname').should('eq', 'http://localhost:4200')

        cy.go('forward')

        cy.location('pathname').should('equal', 'http://localhost:4200/admin')

        cy.contains('USER DASHBOARD')
    })
})