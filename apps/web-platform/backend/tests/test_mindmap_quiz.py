"""Unit tests for Mindmap generation, Flashcards, and SM-2 Spaced Repetition."""

import pytest
from app.services.concept_graph import ConceptGraphService
from app.services.spaced_repetition_quiz import SpacedRepetitionQuizService


def test_concept_graph_mermaid_mindmap():
    topic = "Quantum Computing Foundations"
    content = """
    # Superposition
    - Qubits exist in multiple states simultaneously
    - Bloch sphere geometric representation
    # Quantum Entanglement
    - Non-local correlated particle states
    - Bell inequality verification
    """
    mermaid = ConceptGraphService.generate_mermaid_mindmap(topic, content)
    
    assert "mindmap" in mermaid
    assert "root((Quantum Computing Foundations))" in mermaid
    assert "Superposition" in mermaid
    assert "Quantum Entanglement" in mermaid


def test_sm2_spaced_repetition_calculation():
    # Test quality = 5 (easy recall)
    result = SpacedRepetitionQuizService.calculate_sm2(
        repetition=0,
        interval_days=1,
        ease_factor=2.5,
        quality=5,
    )
    assert result["repetition"] == 1
    assert result["interval_days"] == 1
    assert result["ease_factor"] >= 2.5

    # Second consecutive success
    result2 = SpacedRepetitionQuizService.calculate_sm2(
        repetition=1,
        interval_days=1,
        ease_factor=2.6,
        quality=4,
    )
    assert result2["repetition"] == 2
    assert result2["interval_days"] == 6

    # Failed recall (quality = 1) resets repetition to 0
    result_fail = SpacedRepetitionQuizService.calculate_sm2(
        repetition=3,
        interval_days=14,
        ease_factor=2.5,
        quality=1,
    )
    assert result_fail["repetition"] == 0
    assert result_fail["interval_days"] == 1
