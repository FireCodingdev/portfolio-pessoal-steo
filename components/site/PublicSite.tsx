"use client";

import React, { useEffect, useRef, useState } from "react";
import "./site-original.css";
import {
  AboutContent,
  ContactContent,
  EducationItem,
  ExperienceItem,
  HeroContent,
  Project,
  SiteMeta,
  SkillCategory,
} from "@/lib/defaultContent";

export type PublicSiteContent = {
  hero: HeroContent;
  about: AboutContent;
  skills: SkillCategory[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  contact: ContactContent;
  siteMeta: SiteMeta;
};

export default function PublicSite({ content }: { content: PublicSiteContent }) {
  const { hero, about, skills, projects, experience, education, contact, siteMeta } = content;

  const glowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "", empresa: "" });
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  // Cursor glow + navbar scroll + fade-up observer (comportamento igual ao site original)
  useEffect(() => {
    const glow = glowRef.current;
    const handleMove = (e: MouseEvent) => {
      if (!glow) return;
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", handleMove);

    const handleScroll = () => {
      navRef.current?.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

    // Registra a visita (métrica do dashboard)
    fetch("/api/track/view", { method: "POST" }).catch(() => {});

    return () => {
      document.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  async function handleDownloadCurriculo(e: React.MouseEvent<HTMLAnchorElement>) {
    fetch("/api/track/resume", { method: "POST" }).catch(() => {});
    // não impede o download padrão do link
  }

  async function enviarMensagem(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.assunto.trim() || !form.mensagem.trim()) {
      setFeedback({ tipo: "erro", texto: "⚠️ Por favor, preencha todos os campos antes de enviar." });
      return;
    }
    setEnviando(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.erro || "Erro ao enviar mensagem.");
      }
      setFeedback({ tipo: "ok", texto: "✅ Mensagem enviada com sucesso! Retornarei em breve." });
      setForm({ nome: "", email: "", assunto: "", mensagem: "", empresa: "" });
    } catch (err: any) {
      setFeedback({ tipo: "erro", texto: `⚠️ ${err.message || "Não foi possível enviar sua mensagem."}` });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <div className="cursor-glow" ref={glowRef} />

      <nav id="navbar" ref={navRef}>
        <a href="#hero" className="nav-logo">
          {siteMeta.logoTexto}
          <span>{siteMeta.logoDestaque}</span>
        </a>
        <ul className="nav-links" style={menuOpen ? { display: "flex", flexDirection: "column", position: "fixed", top: 70, left: 0, right: 0, background: "rgba(10,10,10,0.98)", padding: 24, gap: 20, borderBottom: "1px solid rgba(233,30,140,0.2)", backdropFilter: "blur(20px)" } : undefined}>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>Sobre</a></li>
          <li><a href="#skills" onClick={() => setMenuOpen(false)}>Habilidades</a></li>
          <li><a href="#projects" onClick={() => setMenuOpen(false)}>Projetos</a></li>
          <li><a href="#experience" onClick={() => setMenuOpen(false)}>Experiência</a></li>
          <li><a href="#education" onClick={() => setMenuOpen(false)}>Formação</a></li>
          <li><a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>Contato</a></li>
        </ul>
        <div className="hamburger" onClick={() => setMenuOpen((v) => !v)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-content fade-up">
          <div className="hero-badge">
            <i className="fa-solid fa-circle" style={{ color: "var(--pink)", animation: "pulse 2s infinite", fontSize: ".6rem" }}></i>
            {hero.badge}
          </div>
          <h1 className="hero-title">
            {hero.saudacao}<br />
            <span className="name">{hero.nome}</span>
            <span className="role">{hero.cargo}</span>
          </h1>
          <p className="hero-desc">{hero.descricao}</p>
          <div className="hero-buttons">
            <a href={hero.botaoPrimarioLink} className="btn-primary"><i className="fa-solid fa-rocket"></i> {hero.botaoPrimarioTexto}</a>
            <a href={hero.botaoSecundarioLink} className="btn-secondary"><i className="fa-solid fa-paper-plane"></i> {hero.botaoSecundarioTexto}</a>
          </div>
          <div className="hero-stats">
            {hero.stats.map((s, i) => (
              <React.Fragment key={i}>
                <div className="stat">
                  <div className="stat-number">{s.number}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
                {i < hero.stats.length - 1 && <div className="stat-divider"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-avatar">
            <img src={hero.fotoUrl} alt={hero.nome} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
          </div>
        </div>
      </section>

      <div className="glow-divider"></div>

      {/* ABOUT */}
      <section id="about">
        <div className="section-header fade-up">
          <div className="section-label">Quem sou eu</div>
          <h2 className="section-title">Sobre Mim</h2>
          <p className="section-desc">Conheça um pouco mais sobre minha trajetória e motivações na área de tecnologia.</p>
        </div>
        <div className="about-grid">
          <div className="about-card fade-up">
            <div><div className="about-info-label">Nome</div><div className="about-info-value">{about.nome}</div></div>
            <div><div className="about-info-label">Curso</div><div className="about-info-value">{about.curso}</div></div>
            <div><div className="about-info-label">Localização</div><div className="about-info-value">{about.localizacao}</div></div>
            <div><div className="about-info-label">Status</div><div className="about-info-value" style={{ color: "var(--pink)" }}>{about.status}</div></div>
            <div><div className="about-info-label">Foco</div><div className="about-info-value">{about.foco}</div></div>
            <div><div className="about-info-label">Inglês</div><div className="about-info-value">{about.ingles}</div></div>
          </div>
          <div className="about-text fade-up">
            <p>{about.paragrafo1}</p>
            <p>{about.paragrafo2}</p>
            <p>{about.paragrafo3}</p>
            <a href={about.curriculoUrl} download onClick={handleDownloadCurriculo} className="btn-primary" style={{ marginTop: 24, display: "inline-flex" }}>
              <i className="fa-solid fa-download"></i> Baixar Currículo
            </a>
          </div>
        </div>
      </section>

      <div className="glow-divider"></div>

      {/* SKILLS */}
      <section id="skills">
        <div className="section-header fade-up">
          <div className="section-label">O que eu sei fazer</div>
          <h2 className="section-title">Habilidades Técnicas</h2>
          <p className="section-desc">Tecnologias e ferramentas que utilizo para construir soluções completas e modernas.</p>
        </div>
        <div className="skills-grid">
          {skills.map((cat) => (
            <div className="skill-category fade-up" key={cat.id}>
              <div className="skill-cat-icon"><i className={cat.icone}></i></div>
              <div className="skill-cat-title">{cat.titulo}</div>
              <div className="skill-tags">
                {cat.tags.map((tag, i) => (
                  <span className="skill-tag" key={i}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glow-divider"></div>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-header fade-up">
          <div className="section-label">O que eu construí</div>
          <h2 className="section-title">Projetos</h2>
          <p className="section-desc">Uma seleção dos meus principais projetos acadêmicos e pessoais.</p>
        </div>
        <div className="projects-grid">
          {projects.map((p) => (
            <div className="project-card fade-up" key={p.id}>
              <div className="project-thumb">{p.emoji}</div>
              <div className="project-body">
                <div className="project-tags">
                  {p.tags.map((t, i) => (
                    <span className="project-tag" key={i}>{t}</span>
                  ))}
                </div>
                <div className="project-name">{p.nome}</div>
                <div className="project-desc">{p.descricao}</div>
                <div className="project-links">
                  <a href={p.linkCodigo} className="project-link"><i className="fa-brands fa-github"></i> Código</a>
                  <a href={p.linkDemo} className="project-link"><i className="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glow-divider"></div>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="section-header fade-up">
          <div className="section-label">Minha trajetória</div>
          <h2 className="section-title">Experiência</h2>
          <p className="section-desc">Atividades profissionais e acadêmicas que moldaram meu perfil técnico.</p>
        </div>
        <div className="timeline fade-up">
          {experience.map((exp) => (
            <div className="timeline-item" key={exp.id}>
              <div className="timeline-role">{exp.cargo}</div>
              <div className="timeline-company">{exp.empresa}</div>
              <div className="timeline-desc">{exp.descricao}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="glow-divider"></div>

      {/* EDUCATION */}
      <section id="education">
        <div className="section-header fade-up">
          <div className="section-label">Minha formação</div>
          <h2 className="section-title">Educação</h2>
          <p className="section-desc">Cursos, certificações e formações que fazem parte da minha evolução profissional.</p>
        </div>
        <div className="education-grid">
          {education.map((ed) => (
            <div className="edu-card fade-up" key={ed.id}>
              <div className="edu-icon"><i className={ed.icone}></i></div>
              <div>
                {ed.periodo && <div className="edu-period">{ed.periodo}</div>}
                <div className="edu-title">{ed.titulo}</div>
                <div className="edu-inst">{ed.instituicao}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glow-divider"></div>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-header fade-up">
          <div className="section-label">Vamos conversar</div>
          <h2 className="section-title">Contato</h2>
          <p className="section-desc">Estou disponível para oportunidades, projetos freelancer e colaborações.</p>
        </div>
        <div className="contact-wrapper">
          <div className="fade-up">
            <p style={{ color: "var(--gray)", lineHeight: 1.8, marginBottom: 8 }}>{contact.textoIntro}</p>
            <div className="contact-links">
              <a href={`mailto:${contact.email}`} className="contact-link-item">
                <div className="contact-link-icon"><i className="fa-solid fa-envelope"></i></div>
                <div className="contact-link-info">
                  <div className="contact-link-label">Email</div>
                  <div className="contact-link-value">{contact.email}</div>
                </div>
                <i className="fa-solid fa-arrow-right contact-link-arrow"></i>
              </a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="contact-link-item">
                <div className="contact-link-icon"><i className="fa-brands fa-linkedin-in"></i></div>
                <div className="contact-link-info">
                  <div className="contact-link-label">LinkedIn</div>
                  <div className="contact-link-value">{contact.linkedinLabel}</div>
                </div>
                <i className="fa-solid fa-arrow-right contact-link-arrow"></i>
              </a>
              <a href={contact.github} target="_blank" rel="noreferrer" className="contact-link-item">
                <div className="contact-link-icon"><i className="fa-brands fa-github"></i></div>
                <div className="contact-link-info">
                  <div className="contact-link-label">GitHub</div>
                  <div className="contact-link-value">{contact.githubLabel}</div>
                </div>
                <i className="fa-solid fa-arrow-right contact-link-arrow"></i>
              </a>
              <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="contact-link-item">
                <div className="contact-link-icon"><i className="fa-brands fa-whatsapp"></i></div>
                <div className="contact-link-info">
                  <div className="contact-link-label">WhatsApp</div>
                  <div className="contact-link-value">{contact.whatsappLabel}</div>
                </div>
                <i className="fa-solid fa-arrow-right contact-link-arrow"></i>
              </a>
            </div>
          </div>
          <form className="contact-form fade-up" onSubmit={enviarMensagem}>
            {/* honeypot anti-spam, invisível para humanos */}
            <input
              type="text"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              aria-hidden="true"
            />
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input type="text" className="form-input" placeholder="Seu nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Assunto</label>
              <input type="text" className="form-input" placeholder="Proposta, parceria, projeto..." value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Mensagem</label>
              <textarea className="form-textarea" placeholder="Conte um pouco sobre o que você precisa..." value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }} disabled={enviando}>
              <i className="fa-solid fa-paper-plane"></i> {enviando ? "Enviando..." : "Enviar Mensagem"}
            </button>
            {feedback && (
              <p style={{ display: "block", marginTop: 12, fontSize: "0.9rem", color: feedback.tipo === "ok" ? "#80ffcc" : "#ff4db8" }}>
                {feedback.texto}
              </p>
            )}
          </form>
        </div>
      </section>

      <footer>
        <a href="#hero" className="footer-logo">{siteMeta.logoTexto}<span>{siteMeta.logoDestaque}</span></a>
        <p className="footer-text" dangerouslySetInnerHTML={{ __html: siteMeta.rodapeTexto }}></p>
        <div className="footer-social">
          <a href={contact.github} target="_blank" rel="noreferrer" className="social-link"><i className="fa-brands fa-github"></i></a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="social-link"><i className="fa-brands fa-linkedin-in"></i></a>
          <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="social-link"><i className="fa-brands fa-whatsapp"></i></a>
          <a href={`mailto:${contact.email}`} className="social-link"><i className="fa-solid fa-envelope"></i></a>
        </div>
      </footer>
    </>
  );
}
