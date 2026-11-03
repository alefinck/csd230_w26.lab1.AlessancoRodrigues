package csd230.lab1.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;
@Entity @DiscriminatorValue("DISCMAG")
public class DiscMagEntity extends MagazineEntity {
    private Boolean hasDisc;
    public DiscMagEntity() {}
    public DiscMagEntity(String t, Double p, Integer c, Integer o, LocalDateTime d, Boolean h) { super(t, p, c, o, d); this.hasDisc = h; }
    public Boolean getHasDisc() { return hasDisc; }
    public void setHasDisc(Boolean h) { this.hasDisc = h; }
    @Override public String toString() { return "DiscMag{disc=" + hasDisc + ", " + super.toString() + "}"; }
}