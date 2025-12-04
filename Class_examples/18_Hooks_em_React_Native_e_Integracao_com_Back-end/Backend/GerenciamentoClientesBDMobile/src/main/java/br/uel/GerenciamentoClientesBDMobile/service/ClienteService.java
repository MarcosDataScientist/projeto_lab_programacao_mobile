package br.uel.GerenciamentoClientesBDMobile.service;

import br.uel.GerenciamentoClientesBDMobile.model.Cliente;
import br.uel.GerenciamentoClientesBDMobile.repository.ClienteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll(Sort.by("nome").ascending());
    }

    public Cliente cadastrarCliente(Cliente c) {
        if (clienteRepository.existsByEmail(c.getEmail())) {
            throw new DataIntegrityViolationException("Já existe um cliente com esse e-mail.");
        }
        return clienteRepository.save(c);
    }

    public Cliente atualizarCliente(Long id, Cliente clienteAtualizado) {
        if (clienteRepository.existsByEmailAndIdNot(clienteAtualizado.getEmail(), id)) {
            throw new DataIntegrityViolationException("Já existe outro cliente com esse e-mail.");
        }

        Cliente cliente = clienteRepository.findById(id).orElse(null);

        if (cliente != null) {
            cliente.setNome(clienteAtualizado.getNome());
            cliente.setEmail(clienteAtualizado.getEmail());
            cliente.setIdade(clienteAtualizado.getIdade());
            return clienteRepository.save(cliente);
        } else {
            throw new RuntimeException("Cliente não encontrado com id: " + id);
        }
    }

    public void excluirCliente(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado com id: " + id);
        }
        clienteRepository.deleteById(id);
    }
}
