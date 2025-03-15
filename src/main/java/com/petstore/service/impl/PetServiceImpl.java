package com.petstore.service.impl;

import com.petstore.model.Pet;
import com.petstore.repository.PetMapper;
import com.petstore.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetMapper petMapper;

    @Override
    public List<Pet> findAllPets() {
        return petMapper.findAll();
    }

    @Override
    public Pet findPetById(Long id) {
        return petMapper.findById(id);
    }

    @Override
    public Pet savePet(Pet pet) {
        petMapper.insert(pet);
        return pet;
    }

    @Override
    public Pet updatePet(Pet pet) {
        petMapper.update(pet);
        return pet;
    }

    @Override
    public boolean deletePet(Long id) {
        return petMapper.deleteById(id) > 0;
    }
} 