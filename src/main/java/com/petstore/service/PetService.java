package com.petstore.service;

import com.petstore.model.Pet;
import java.util.List;

public interface PetService {
    List<Pet> findAllPets();
    Pet findPetById(Long id);
    Pet savePet(Pet pet);
    Pet updatePet(Pet pet);
    boolean deletePet(Long id);
} 