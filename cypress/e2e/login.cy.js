describe('Login y sesión', () => {

  beforeEach(() => {
    // Limpiamos sesión antes de cada test para que sean independientes
    cy.visit('/login.html')
  })

  it('Admin llega al dashboard', () => {
    cy.get('[data-cy="email"]').type('admin@sigaf.com')
    cy.get('[data-cy="password"]').type('Sigaf2026!')
    cy.get('[data-cy="btn-login"]').click()
    cy.url().should('include', '/dashboard.html')
    cy.get('#welcome-message').should('contain', 'Admin SIGAF')
  })

  it('Cierre de sesión redirige al login', () => {
    // Login rápido para probar el logout
    cy.get('[data-cy="email"]').type('admin@sigaf.com')
    cy.get('[data-cy="password"]').type('Sigaf2026!')
    cy.get('[data-cy="btn-login"]').click()
    
    // Click en logout
    cy.get('[data-cy="btn-logout"]').click()
    cy.url().should('include', '/login.html')
  })

  it('Trabajador no ve Empleados', () => {
    cy.get('[data-cy="email"]').type('miguel@sigaf.com')
    cy.get('[data-cy="password"]').type('Sigaf2026!')
    cy.get('[data-cy="btn-login"]').click()
    
    cy.url().should('include', '/dashboard.html')
    // El sidebar no debe contener el link de usuarios/empleados para un trabajador
    cy.get('[data-cy="sidebar"]').should('not.contain', 'Empleados')
  })

})