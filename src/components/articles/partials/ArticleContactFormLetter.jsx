import "./ArticleContactFormLetter.scss"
import React from 'react'
import ImageView from "/src/components/generic/ImageView.jsx"
import { useLanguage } from "/src/providers/LanguageProvider.jsx"

export default function ArticleContactFormLetter({ name, email }) {
    const language = useLanguage()

    return (
        <div className="contact-postcard-letter-wrapper text-1">
            <div className="contact-blob-bg" />
            
            <div className="contact-quill-wrapper">
                <ImageView 
                    src="images/contact/quill.webp"
                    className="contact-quill"
                    hideSpinner={true} 
                    alt="Quill" 
                />
            </div>
            
            <div className="contact-postcard-letter-stack">
                {/* Segmented Postcard Animation */}
                <div className="contact-postcard">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} 
                             className="contact-postcard-segment"
                             style={{ backgroundPosition: `calc(-6.666em * ${index})` }} />
                    ))}
                </div>
                
                {/* Real-time Rendering Letter */}
                <div className="contact-letter">
                    <p className="contact-letter-line contact-letter-from">
                        {language.getString("from_label") || "From"}{" "}  
                        <span className="contact-letter-value">{name}</span>
                    </p>
                    <p className="contact-letter-line contact-letter-email">
                        {language.getString("email_label") || "Email"}{" "}  
                        <span className="contact-letter-value">{email}</span>
                    </p>
                    <p className="contact-letter-signoff">
                        {language.getString("with_love") || "With love"}
                    </p>
                </div>
            </div>
        </div>
    )
}
