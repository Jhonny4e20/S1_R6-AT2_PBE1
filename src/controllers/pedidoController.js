const { pedidoModel } = require("../models/pedidoModel"); //importa o modelo de pedido
const { clienteModel } = require("../models/clienteModel"); //importa o modelo de cliente

const pedidoController = {

    listarPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModel.buscarTodos(); //busca todos os pedidos no banco de dados
            res.status(200).json(pedidos);

        } catch (error) {
            console.error("ERRO ao listar pedidos:", error);
            res.status(500).json({ erro: "ERRO interno ao listar pedidos!" }); //retorna erro 500 em caso de falha no servidor
        }
    },
   criarPedido: async (req, res) => {
        
        try{

        const { idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKm,
                pesoCarga, 
                valorKm, 
                valorKg
                } = req.body

            if(idCliente == undefined || dataPedido == undefined || tipoEntrega == undefined || distanciaKm == undefined || pesoCarga == undefined || valorKm == undefined || valorKg == undefined){
                return res.status(400).json({erro: "Campos obrigatórios não foram preenchidos"})
            }

            if ( isNaN(distanciaKm) || isNaN(pesoCarga) || isNaN(valorKm) || isNaN(valorKg)  ) {
                return res.status(400).json({erro: "Campos preenchidos com valores inválidos"})
            }

            if(idCliente.length != 36 ){
                return res.status(400).json({erro: "Id do Cliente inválido"})
            }
            
            const data = new Date(dataPedido);
            if(isNaN(data.getTime())){
                return res.status(400).json({erro: "Data do pedido inválida"})
            }
            
            const cliente = await clienteModel.buscarUm(idCliente); 

            if(!cliente || cliente.length != 1){
                return res.status(404).json({erro: "Cliente não encontrado"})
            }  

            valorDistanciaEntrega = distanciaKm * valorKm

            valorPesoEntrega = pesoCarga * valorKg

            valorFinalEntrega = valorPesoEntrega + valorDistanciaEntrega


            
            if(tipoEntrega == "urgente".toLowerCase()){
                acrescimoEntrega = (valorFinalEntrega * 0.2)

                valorFinalEntrega = valorFinalEntrega + acrescimoEntrega
                
                if(pesoCarga > 50){
                taxaExtraEntrega = valorFinalEntrega + 15
            }

                if(valorFinalEntrega > 500){
                descontoEntrega = (valorFinalEntrega * 0.1) + valorFinalEntrega
            }
            } 

            if(valorFinalEntrega > 500){
                descontoEntrega = (valorFinalEntrega * 0.1) + valorFinalEntrega
            }

            if(pesoCarga > 50){
                taxaExtraEntrega = valorFinalEntrega + 15
            }


            await pedidoModel.inserirPedidos( idCliente, dataPedido, tipoEntrega, distanciaKm, pesoCarga, valorKm, valorKg);

            res.status(201).json({ message: "Pedido cadastrado com sucesso!"});
        }catch (error) {
            console.error("Erro ao cadastrar pedido:", error)
            res.status(500).json({message: "Erro interno no servidor ao cadastrar pedido!"});
        }

    },

    atualizarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params; //pega o idPedido dos parâmetros da rota
            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKm,
                pesoCarga,
                valorKm,
                valorKg
            } = req.body; 

            if (idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" }); //valida o idPedido
            }

            const pedido = await pedidoModel.buscarUm(idPedido); //busca o pedido pelo idPedido

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" }); //retorna erro 404 se o pedido não for encontrado
            } 

            if (idCliente) {
                if (idCliente.length !== 36) {
                    return res.status(400).json({ erro: "ID do cliente inválido!" }); //valida o idCliente
                }

                const cliente = await clienteModel.buscarUm(idCliente); //busca o cliente pelo idCliente
                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: "Cliente não encontrado!" }); //retorna erro 404 se o cliente não for encontrado
                }
            }

            const pedidoAtual = pedido[0]; //pega o pedido atual

            await pedidoModel.atualizarPedido( //atualiza o pedido no banco de dados
                idPedido,
                idCliente ?? pedidoAtual.idCliente,
                dataPedido ?? pedidoAtual.dataPedido,
                tipoEntrega ?? pedidoAtual.tipoEntrega,
                distanciaKm ?? pedidoAtual.distanciaKm,
                pesoCarga ?? pedidoAtual.pesoCarga,
                valorKm ?? pedidoAtual.valorKm,
                valorKg ?? pedidoAtual.valorKg
            ); //atualiza o pedido no banco de dados

            res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" }); //retorna sucesso 200 em caso de atualização bem-sucedida

        } catch (error) {
            console.error("ERRO ao atualizar pedido:", error);
            res.status(500).json({ erro: "Erro interno ao atualizar pedido!" }); //retorna erro 500 em caso de falha no servidor
        }
    },

    deletarPedido: async (req, res) => { //deleta um pedido
        try {
            const { idPedido } = req.params;

            if (idPedido.length !== 36) { //valida o idPedido
                return res.status(400).json({ erro: "ID do pedido inválido!" }); //retorna erro 400 em caso de idPedido inválido
            }

            const pedido = await pedidoModel.buscarUm(idPedido); //busca o pedido pelo idPedido

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" }); //retorna erro 404 se o pedido não for encontrado
            }

            await pedidoModel.deletarPedido(idPedido);

            res.status(200).json({ mensagem: "Pedido deletado com sucesso!" }); //retorna sucesso 200 em caso de deleção bem-sucedida

        } catch (error) {
            console.error("ERRO ao deletar pedido:", error);
            res.status(500).json({ erro: "Erro interno ao deletar pedido!" }); //retorna erro 500 em caso de falha no servidor
        }
    }
};

module.exports = { pedidoController }; //exporta o pedidoController