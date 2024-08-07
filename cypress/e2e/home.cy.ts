describe("Planner", () => {
  beforeEach(() => {
    cy.visit("https://planner-vue.vercel.app/");
  });
  describe("Página inicial", () => {
    it("Deve exibir os elementos principais na página inicial", () => {
      cy.get('img[alt="plann.er"]').should("be.visible");
      cy.get("input").should("be.visible");
      cy.get("button").should("be.visible");
      cy.contains("Convide seus amigos e planeje sua próxima viagem!").should(
        "be.visible"
      );
      cy.wait(1200);
    });

    it("Validação de campos vazios", () => {
      cy.get("button").contains("Continuar").click();
      cy.get(".text-red-500").should("be.visible");
      cy.wait(1200);
    });
  });
  describe("Preenchimento e alteração de dados da viagem", () => {
    it("Preenchimento de dados da viagem", () => {
      cy.get('input[placeholder="Para onde você vai?"]').type("Rio de Janeiro");
      cy.get('input[placeholder="Quando?"]').click();
      cy.get(".dp__calendar_item").contains("15").click();
      cy.get("button").contains("Select").click();
      cy.get("button").contains("Continuar").click();
    });

    it("Deve permitir alterar data e local da viagem", () => {
      cy.get('input[placeholder="Para onde você vai?"]').type("Rio de Janeiro");
      cy.get('input[placeholder="Quando?"]').click();
      cy.get(".dp__calendar_item").contains("15").click();
      cy.get("button").contains("Select").click();
      cy.get("button").contains("Continuar").click();

      cy.get("button").contains("Alterar local/data").click();
      cy.get('input[placeholder="Para onde você vai?"]')
        .clear()
        .type("Florianópolis");
      cy.get('input[placeholder="Quando?"]').click();
      cy.get(".dp__calendar_item").contains("20").click();
      cy.get("button").contains("Select").click();
      cy.get("button").contains("Continuar").click();
    });
  });
  describe("Convite de pessoas e confirmação da viagem", () => {
    beforeEach(() => {
      cy.get('input[placeholder="Para onde você vai?"]').type("Florianópolis");
      cy.get('input[placeholder="Quando?"]').click();
      cy.get(".dp__calendar_item").contains("20").click();
      cy.get("button").contains("Select").click();
      cy.get("button").contains("Continuar").click();
    });

    it("Deve abrir o modal de convidar hóspedes", () => {
      cy.contains("button", "Quem estará na viagem?").click();
      cy.get(".fixed.inset-0").should("be.visible");
      cy.contains("h2", "Selecionar convidados").should("be.visible");
    });

    it("Deve validar e-mail inválido", () => {
      cy.contains("button", "Quem estará na viagem?").click();
      cy.get('input[placeholder="Digite o e-mail do convidado"]').type(
        "invalid-email"
      );
      cy.contains("button", "Convidar").click();
      cy.contains("O e-mail fornecido não é válido").should("be.visible");
    });

    it("Deve adicionar um convidado válido", () => {
      cy.contains("button", "Quem estará na viagem?").click();
      cy.get('input[placeholder="Digite o e-mail do convidado"]')
        .clear()
        .type("test@example.com");
      cy.contains("button", "Convidar").click();
      cy.contains("1 pessoa(s) convidada(s)").should("be.visible");
    });

    it("Deve impedir a adição de e-mail duplicado", () => {
      cy.contains("button", "Quem estará na viagem?").click();
      cy.get('input[placeholder="Digite o e-mail do convidado"]').type(
        "test@example.com"
      );
      cy.contains("button", "Convidar").click();
      cy.get('input[placeholder="Digite o e-mail do convidado"]').type(
        "test@example.com"
      );
      cy.contains("button", "Convidar").click();
      cy.contains("Este e-mail já foi adicionado!").should("be.visible");
    });

    it("Deve confirmar a criação da viagem, cadastrar uma atividade editar data e local", () => {
      cy.contains("button", "Quem estará na viagem?").click();
      cy.get('input[placeholder="Digite o e-mail do convidado"]').type(
        "test@example.com"
      );
      cy.contains("button", "Convidar").click();
      cy.get(".fixed.inset-0").find("button").first().click();

      cy.contains("button", "Confirmar viagem").click();
      cy.get(".fixed.inset-0").should("be.visible");
      cy.contains("h2", "Confirmar criação de viagem").should("be.visible");

      cy.get('input[placeholder="Seu nome completo"]').type("Daniel Rubens");
      cy.get('input[placeholder="Seu e-mail pessoal"]').type(
        "front@example.com"
      );
      cy.get('button[type="submit"]')
        .contains("Confirmar criação da viagem")
        .click();
      cy.url().should("include", "/trips");

      cy.contains("button", "Cadastrar atividade").click();
      cy.get('input[placeholder="Qual a atividade?"]').type(
        "Passeio até o lago Paranoá"
      );
      cy.get('input[placeholder="Horário da atividade"]').type("10:00");
      cy.get("button").contains("Select").click();

      cy.get('input[placeholder="Data"]').type("2022-01-15");
      cy.get(".dp__calendar_item").contains("15").click();
      cy.get("button").contains("Salvar atividade").click();

      cy.contains('button', 'Alterar local/data').click();
      
      cy.get('input[placeholder="Destino"]').clear().type('Brasília');
      cy.get('input[placeholder="Quando?"]').clear()
      cy.get(".dp__calendar_item").contains("10").click();
      cy.get("button").contains("Select").click();
      cy.get("button").contains("Salva").click();
    });
    
  });
});
